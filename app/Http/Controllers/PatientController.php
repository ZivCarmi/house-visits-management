<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\FollowUpFrequency;
use App\Http\Requests\PatientRequest;
use App\Models\Patient;
use App\Services\VisitCalculationService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Inertia\Inertia;

class PatientController extends Controller
{
    private const VALID_FILTERS = ['all', 'weekly', 'monthly', 'overdue'];

    /** Timezone for "today" / "this week" / "this month" in visit filters (Israeli week = Sun–Sat). */
    private const VISIT_FILTER_TIMEZONE = 'Asia/Jerusalem';

    private function patientsQuery(): Builder
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
            $query->where('id_number', 'like', '%'.$search.'%');
        }

        $filter = request('filter', 'all');
        if (is_string($filter) && in_array($filter, self::VALID_FILTERS, true) && $filter !== 'all') {
            $today = Carbon::today(self::VISIT_FILTER_TIMEZONE);
            match ($filter) {
                'weekly' => $query->whereBetween('next_visit_date', [
                    $today->copy()->subDays($today->dayOfWeek)->startOfDay(),
                    $today->copy()->subDays($today->dayOfWeek)->addDays(6)->endOfDay(),
                ]),
                'monthly' => $query->whereBetween('next_visit_date', [
                    $today->copy()->startOfMonth(),
                    $today->copy()->endOfMonth(),
                ]),
                'overdue' => $query->whereDate('next_visit_date', '<', $today),
                default => null,
            };
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

        $filter = request('filter', 'all');
        $filterValue = is_string($filter) && in_array($filter, self::VALID_FILTERS, true) ? $filter : 'all';

        return array_merge([
            'patients' => $this->patientsQuery()->paginate(15)->withQueryString(),
            'search' => $searchValue,
            'sort_column' => $sortColumn,
            'sort_direction' => $sortDirection,
            'filter' => $filterValue,
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
            request()->only(['search', 'sort_column', 'sort_direction', 'filter', 'page'])
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
            request()->only(['search', 'sort_column', 'sort_direction', 'filter', 'page'])
        );
    }

    public function destroy(Patient $patient)
    {
        $patient->delete();

        return redirect()->route(
            'patients.index',
            request()->only(['search', 'sort_column', 'sort_direction', 'filter', 'page'])
        );
    }
}
