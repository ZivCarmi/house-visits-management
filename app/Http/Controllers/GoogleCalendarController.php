<?php

namespace App\Http\Controllers;

use App\Http\Requests\CalendarEventRequest;
use App\Models\Patient;
use App\Services\GoogleCalendarService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GoogleCalendarController extends Controller
{
    public function connect(Request $request, GoogleCalendarService $calendarService): RedirectResponse
    {
        $state = $request->query('state', 'profile');
        $authUrl = $calendarService->getAuthUrl($state);

        return redirect($authUrl);
    }

    public function callback(Request $request, GoogleCalendarService $calendarService): RedirectResponse
    {
        $code = $request->query('code');
        $state = $request->query('state', 'profile');

        if (! $code) {
            return redirect()->route('profile.edit')
                ->with('error', 'חיבור יומן Google נכשל');
        }

        try {
            $calendarService->handleCallback($code);

            if (str_starts_with($state, 'patient_')) {
                $patientId = str_replace('patient_', '', $state);

                return redirect()->route('patients.index', ['schedule' => $patientId])
                    ->with('success', 'יומן Google חובר בהצלחה');
            }

            return redirect()->route('profile.edit')
                ->with('success', 'יומן Google חובר בהצלחה');
        } catch (\Exception $e) {
            Log::error('Google Calendar callback failed', [
                'message' => $e->getMessage(),
                'exception' => $e,
            ]);

            return redirect()->route('profile.edit')
                ->with('error', 'חיבור יומן Google נכשל: '.$e->getMessage());
        }
    }

    public function createEvent(CalendarEventRequest $request, GoogleCalendarService $calendarService): RedirectResponse
    {
        $patient = Patient::findOrFail($request->validated('patient_id'));

        try {
            $event = $calendarService->createEvent(
                $patient,
                $request->validated('start_datetime'),
                $request->validated('end_datetime'),
                $request->validated('notes'),
                $request->validated('color_id')
            );

            return redirect()->back()
                ->with('success', 'האירוע נוסף ליומן Google בהצלחה')
                ->with('eventHtmlLink', $event['htmlLink']);
        } catch (\Exception $e) {
            Log::warning('Google Calendar event creation failed', [
                'patient_id' => $patient->id,
                'message' => $e->getMessage(),
                'exception' => $e,
            ]);

            return redirect()->back()
                ->with('error', 'יצירת האירוע נכשלה. נסה שוב מאוחר יותר.');
        }
    }

    public function disconnect(GoogleCalendarService $calendarService): RedirectResponse
    {
        try {
            $calendarService->disconnect();

            return redirect()->back()
                ->with('success', 'יומן Google נותק בהצלחה');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'ניתוק יומן Google נכשל: '.$e->getMessage());
        }
    }

    public function status(GoogleCalendarService $calendarService): array
    {
        return [
            'connected' => $calendarService->isConnected(),
        ];
    }
}
