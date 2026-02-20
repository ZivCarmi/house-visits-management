<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\FollowUpFrequency;
use App\Http\Requests\PatientRequest;
use App\Models\Patient;
use App\Services\VisitCalculationService;
use Inertia\Inertia;

class PatientController extends Controller
{
    private function patientsQuery(): \Illuminate\Database\Eloquent\Builder
    {
        $sortColumn = request('sort_column', 'next_visit_date');
        if (! in_array($sortColumn, ['last_visit_date', 'next_visit_date'], true)) {
            $sortColumn = 'next_visit_date';
        }
        $sortDirection = strtolower(request('sort_direction', 'desc'));
        if (! in_array($sortDirection, ['asc', 'desc'], true)) {
            $sortDirection = 'desc';
        }

        $query = Patient::query()->orderBy($sortColumn, $sortDirection);

        $search = request('search');
        if (is_string($search) && $search !== '' && preg_match('/^\d+$/', $search)) {
            $query->where('id_number', 'like', '%' . $search . '%');
        }

        return $query;
    }

    private function indexProps(array $extra = []): array
    {
        $sortColumn = request('sort_column', 'next_visit_date');
        if (! in_array($sortColumn, ['last_visit_date', 'next_visit_date'], true)) {
            $sortColumn = 'next_visit_date';
        }
        $sortDirection = strtolower(request('sort_direction', 'desc'));
        if (! in_array($sortDirection, ['asc', 'desc'], true)) {
            $sortDirection = 'desc';
        }

        $search = request('search');
        $searchValue = is_string($search) && preg_match('/^\d*$/', $search) ? $search : '';

        return array_merge([
            'patients' => $this->patientsQuery()->paginate(15)->withQueryString(),
            'search' => $searchValue,
            'sort_column' => $sortColumn,
            'sort_direction' => $sortDirection,
        ], $extra);
    }

    public function index()
    {
        $extra = [];
        if (request()->boolean('create')) {
            $extra['openCreateDialog'] = true;
        }

        return Inertia::render('Patients/Index', $this->indexProps($extra));
    }

    public function create()
    {
        return Inertia::render('Patients/Index', $this->indexProps([
            'openCreateDialog' => true,
        ]));
    }

    public function store(PatientRequest $request, VisitCalculationService $visitCalculationService)
    {
        $validated = $request->validated();

        $nextVisitDate = $visitCalculationService->calculateNextVisitDate(
            $request->date('last_visit_date')->toImmutable(),
            $request->enum('followup_frequency', FollowUpFrequency::class)
        );

        $validated['next_visit_date'] = $nextVisitDate;

        Patient::create($validated);

        return redirect()->route(
            'patients.index',
            request()->only(['search', 'sort_column', 'sort_direction', 'page'])
        );
    }

    public function edit(Patient $patient)
    {
        return Inertia::render('Patients/Index', $this->indexProps([
            'openEditDialog' => true,
            'editPatient' => $patient,
        ]));
    }

    public function update(PatientRequest $request, Patient $patient, VisitCalculationService $visitCalculationService)
    {
        $validated = $request->validated();

        $nextVisitDate = $visitCalculationService->calculateNextVisitDate(
            $request->date('last_visit_date')->toImmutable(),
            $request->enum('followup_frequency', FollowUpFrequency::class)
        );

        $validated['next_visit_date'] = $nextVisitDate;

        $patient->update($validated);

        return redirect()->route(
            'patients.index',
            request()->only(['search', 'sort_column', 'sort_direction', 'page'])
        );
    }

    public function destroy(Patient $patient)
    {
        $patient->delete();

        return redirect()->route(
            'patients.index',
            request()->only(['search', 'sort_column', 'sort_direction', 'page'])
        );
    }
}
