<?php

namespace App\Services;

use App\Models\Patient;
use Carbon\Carbon;
use Google\Client as GoogleClient;
use Google\Service\Calendar;
use Google\Service\Calendar\Event;

class GoogleCalendarService
{
    public function getAuthUrl(string $state): string
    {
        $client = new GoogleClient;
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(route('google-calendar.callback'));
        $client->addScope(Calendar::CALENDAR_EVENTS);
        $client->setState($state);
        $client->setAccessType('offline');
        $client->setPrompt('consent');

        return $client->createAuthUrl();
    }

    public function handleCallback(string $code): void
    {
        $client = new GoogleClient;
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setRedirectUri(route('google-calendar.callback'));

        $token = $client->fetchAccessTokenWithAuthCode($code);

        if (isset($token['error'])) {
            throw new \Exception('Failed to fetch access token: '.$token['error']);
        }

        auth()->user()->googleCalendarToken()->updateOrCreate(
            ['user_id' => auth()->id()],
            [
                'access_token' => $token['access_token'],
                'refresh_token' => $token['refresh_token'] ?? null,
                'expires_at' => now()->addSeconds($token['expires_in']),
            ]
        );
    }

    public function createEvent(Patient $patient, string $startDateTime, string $endDateTime, ?string $notes, ?int $colorId = null): array
    {
        $client = $this->getClient();
        $service = new Calendar($client);

        $timezone = 'Asia/Jerusalem';
        $startRfc3339 = Carbon::parse($startDateTime, $timezone)->toRfc3339String();
        $endRfc3339 = Carbon::parse($endDateTime, $timezone)->toRfc3339String();

        $eventData = [
            'summary' => "ביקור בית - {$patient->full_name}",
            'description' => $notes ? "הערות: {$notes}\n\nפרטי המטופל:\nשם: {$patient->full_name}\nטלפון: {$patient->phone}" : "פרטי המטופל:\nשם: {$patient->full_name}\nטלפון: {$patient->phone}",
            'location' => $patient->address ?? '',
            'start' => [
                'dateTime' => $startRfc3339,
                'timeZone' => $timezone,
            ],
            'end' => [
                'dateTime' => $endRfc3339,
                'timeZone' => $timezone,
            ],
        ];

        if ($colorId !== null) {
            $eventData['colorId'] = (string) $colorId;
        }

        $event = new Event($eventData);

        $createdEvent = $service->events->insert('primary', $event);

        return [
            'id' => $createdEvent->getId(),
            'htmlLink' => $createdEvent->getHtmlLink(),
        ];
    }

    public function isConnected(): bool
    {
        return auth()->user()->googleCalendarToken()->exists();
    }

    public function disconnect(): void
    {
        auth()->user()->googleCalendarToken()->delete();
    }

    private function getClient(): GoogleClient
    {
        $token = auth()->user()->googleCalendarToken;

        if (! $token) {
            throw new \Exception('Google Calendar not connected');
        }

        $client = new GoogleClient;
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));
        $client->setAccessToken($token->access_token);

        if ($token->isExpired()) {
            if (! $token->refresh_token) {
                throw new \Exception('No refresh token available');
            }

            $client->refreshToken($token->refresh_token);
            $newToken = $client->getAccessToken();

            $token->update([
                'access_token' => $newToken['access_token'],
                'expires_at' => now()->addSeconds($newToken['expires_in']),
            ]);
        }

        return $client;
    }
}
