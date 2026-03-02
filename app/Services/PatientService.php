<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\PatientFilterDTO;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class PatientService
{
    private const VISIT_FILTER_TIMEZONE = 'Asia/Jerusalem';

    public function getPaginatedPatients(User $user, PatientFilterDTO $filters): LengthAwarePaginator
    {
        $query = $this->buildQuery($user, $filters);

        return $query->paginate(15, ['*'], 'page', $filters->page)->withQueryString();
    }

    public function createPatient(User $user, array $data): Patient
    {
        return $user->patients()->create($data);
    }

    public function updatePatient(Patient $patient, array $data): bool
    {
        return $patient->update($data);
    }

    public function deletePatient(Patient $patient): bool
    {
        return $patient->delete();
    }

    private function buildQuery(User $user, PatientFilterDTO $filters): Builder
    {
        $query = $user->patients()
            ->sortBy($filters->sortColumn, $filters->sortDirection)
            ->search($filters->search);

        if ($filters->filter !== 'all') {
            match ($filters->filter) {
                'weekly' => $query->weeklyVisits(self::VISIT_FILTER_TIMEZONE),
                'monthly' => $query->monthlyVisits(self::VISIT_FILTER_TIMEZONE),
                'overdue' => $query->overdueVisits(self::VISIT_FILTER_TIMEZONE),
                default => null,
            };
        }

        return $query;
    }
}
