<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\DTOs\PatientFilterDTO;
use App\Http\Controllers\Concerns\PreservesQueryParameters;
use App\Http\Requests\PatientRequest;
use App\Models\Patient;
use App\Services\PatientService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    use PreservesQueryParameters;

    public function __construct(private readonly PatientService $patientService) {}

    public function index(Request $request): Response
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
            'openCreateDialog' => $request->boolean('create'),
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
        ]);
    }

    public function store(PatientRequest $request)
    {
        $user = $request->user();
        $this->patientService->createPatient($user, $request->validated());

        return redirect()->route('patients.index', $this->preservedQueryParams());
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
}
