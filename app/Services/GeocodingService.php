<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Models\Patient;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeocodingService
{

    private readonly string $apiKey;
    private const GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

    public function __construct()
    {
        $this->apiKey = config('services.google.geocoding_api_key');
    }

    /**
     * Get patients with coordinates for the given IDs (auth-scoped to user).
     * Geocodes and persists latitude/longitude for any patient that has address but no coords.
     *
     * @param  array<int, int>  $ids  Patient IDs (max 15 enforced by caller)
     * @return array<int, array{id: int, full_name: string, address: string, latitude: float|null, longitude: float|null}>
     */
    public function getLocationsForPatientIds(User $user, array $ids): array
    {
        $patients = $user->patients()
            ->whereIn('id', $ids)
            ->get();

        $located = [];
        $failed  = [];

        foreach ($patients as $patient) {
            $coords = $this->resolveCoords($patient);

            if (!$coords) {
                $failed[] = ['id' => $patient->id, 'full_name' => $patient->full_name];
                continue;
            }

            $located[] = [
                'id' => $patient->id,
                'full_name' => $patient->full_name,
                'address' => $patient->address,
                'latitude' => $coords['latitude'],
                'longitude' => $coords['longitude'],
            ];
        }

        return compact('located', 'failed');
    }

    /**
     * Geocode a single address string.
     * Returns ['latitude' => float, 'longitude' => float] or null on failure.
     */
    public function geocode(string $address): ?array
    {
        if (!$this->isValidAddressForGeocoding($address)) {
            return null;
        }

        // Cache by address so identical addresses never hit the API twice
        $cacheKey = 'geocode:' . md5(strtolower(trim($address)));

        return Cache::remember($cacheKey, now()->addDays(30), function () use ($address) {
            return $this->fetchFromGoogle($address);
        });
    }
        
    /**
     * Returns coords for a patient — from DB if already stored,
     * otherwise geocodes and persists for next time.
     */
    private function resolveCoords(Patient $patient): ?array
    {
        if (!is_null($patient->latitude) && !is_null($patient->longitude)) {
            return [
                'latitude' => (float) $patient->latitude,
                'longitude' => (float) $patient->longitude,
            ];
        }

        $coords = $this->geocode($patient->address);

        Log::info('resolveCoords', ['coords' => $coords]);

        if ($coords) {
            $patient->updateQuietly($coords);
        }

        return $coords;
    }

    private function fetchFromGoogle(string $address): ?array
    {
        try {
            $response = Http::timeout(5)->get(self::GEOCODE_URL, [
                'address' => $address,
                'key'     => $this->apiKey,
            ]);

            if (!$response->ok()) {
                Log::warning('Geocoding HTTP error', [
                    'address' => $address,
                    'status'  => $response->status(),
                ]);
                return null;
            }

            $data = $response->json();

            return match ($data['status']) {
                'OK'             => $this->extractCoords($data),
                'ZERO_RESULTS'   => null,  // Valid address, just not found
                'OVER_QUERY_LIMIT' => $this->retryAfterDelay($address),
                default          => $this->logAndFail($address, $data['status']),
            };
        } catch (\Throwable $e) {
            Log::error('Geocoding exception', [
                'address' => $address,
                'error'   => $e->getMessage(),
            ]);
            return null;
        }
    }


    private function extractCoords(array $data): array
    {
        $location = $data['results'][0]['geometry']['location'];


        Log::info('Location', ['location' => $location]);
        return [
            'latitude' => (float) $location['lat'],
            'longitude' => (float) $location['lng'],
        ];
    }

    private function retryAfterDelay(string $address): ?array
    {
        Log::warning('Geocoding rate limited, retrying after 1s', ['address' => $address]);
        sleep(1);
        return $this->fetchFromGoogle($address);
    }

    private function logAndFail(string $address, string $status): null
    {
        Log::warning('Geocoding failed', ['address' => $address, 'status' => $status]);
        return null;
    }

    private function isValidAddressForGeocoding(string $address): bool
    {
        if (blank($address)) {
            return false;
        }

        $trimmed = trim($address);
        $hasDigit = preg_match('/\d/', $trimmed) === 1;
        $wordCount = count(preg_split('/\s+/u', $trimmed, -1, PREG_SPLIT_NO_EMPTY));
        return $hasDigit || $wordCount >= 2;
    }
}
