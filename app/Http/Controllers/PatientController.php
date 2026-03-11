<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\DTOs\PatientFilterDTO;
use App\Http\Controllers\Concerns\PreservesQueryParameters;
use App\Http\Requests\BulkPatientRequest;
use App\Http\Requests\PatientLocationsRequest;
use App\Http\Requests\PatientRequest;
use App\Models\Patient;
use App\Services\GeocodingService;
use App\Services\PatientService;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    use PreservesQueryParameters;

    public function __construct(
        private readonly PatientService $patientService
    ) {}

    public function index(Request $request): Response
    {
        $filters = PatientFilterDTO::fromRequest($request);
        $user = $request->user();
        $patients = $this->patientService->getPaginatedPatients($user, $filters);

        $schedulePatientId = $request->query('schedule');
        $schedulePatient = null;
        if ($schedulePatientId) {
            $schedulePatient = $user->patients()->find($schedulePatientId);
        }

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'search' => $filters->search ?? '',
            'sort_column' => $filters->sortColumn,
            'sort_direction' => $filters->sortDirection,
            'filter' => $filters->filter,
            'openCreateDialog' => $request->boolean('create'),
            'openScheduleDialog' => $schedulePatient !== null,
            'schedulePatient' => $schedulePatient,
            'googleCalendarConnected' => $user->googleCalendarToken()->exists(),
            'googleMapsApiKey' => config('services.google.geocoding_api_key'),
        ]);
    }

    public function create(Request $request): Response
    {
        $filters = PatientFilterDTO::fromRequest($request);
        $user = $request->user();
        $patients = $this->patientService->getPaginatedPatients($user, $filters);

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'search' => $filters->search ?? '',
            'sort_column' => $filters->sortColumn,
            'sort_direction' => $filters->sortDirection,
            'filter' => $filters->filter,
            'openCreateDialog' => true,
            'googleCalendarConnected' => $user->googleCalendarToken()->exists(),
            'googleMapsApiKey' => config('services.google.geocoding_api_key'),
        ]);
    }

    public function store(PatientRequest $request)
    {
        $user = $request->user();
        $this->patientService->createPatient($user, $request->validated());

        return redirect()->route('patients.index', $this->preservedQueryParams());
    }

    public function storeBulk(BulkPatientRequest $request)
    {
        $user = $request->user();

        try {

            $createdCount = $this->patientService->createPatientsBulk(
                $user,
                $request->validated('patients')
            );

            return redirect()
                ->route('patients.index', $this->preservedQueryParams())
                ->with('success_bulk_count', $createdCount);
        } catch (QueryException $e) {
            if ((string) $e->getCode() === '23000') {
                throw ValidationException::withMessages([
                    'message' => ['כבר קיים מטופל עם מספר תעודת זהות זהה.'],
                ]);
            }

            throw $e;
        }
    }

    public function edit(Request $request, Patient $patient): Response
    {
        $filters = PatientFilterDTO::fromRequest($request);
        $user = $request->user();
        $patients = $this->patientService->getPaginatedPatients($user, $filters);

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'search' => $filters->search ?? '',
            'sort_column' => $filters->sortColumn,
            'sort_direction' => $filters->sortDirection,
            'filter' => $filters->filter,
            'openEditDialog' => true,
            'editPatient' => $patient,
            'googleCalendarConnected' => $user->googleCalendarToken()->exists(),
            'googleMapsApiKey' => config('services.google.geocoding_api_key'),
        ]);
    }

    public function update(PatientRequest $request, Patient $patient)
    {
        $this->patientService->updatePatient($patient, $request->validated());

        return redirect()->route('patients.index', $this->preservedQueryParams());
    }

    public function destroy(Patient $patient)
    {
        $this->patientService->deletePatient($patient);

        return redirect()->route('patients.index', $this->preservedQueryParams());
    }

    public function locations(PatientLocationsRequest $request, GeocodingService $geocodingService): JsonResponse
    {
        try {
            $locations = $geocodingService->getLocationsForPatientIds(
                $request->user(),
                $request->validated('ids')
            );

            return response()->json($locations);
        } catch (\Throwable $e) {
            Log::error('Failed to fetch patient locations', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Could not retrieve locations'], 500);
        }
    }
}
