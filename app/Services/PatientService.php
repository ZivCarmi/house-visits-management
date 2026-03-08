<?php

declare(strict_types=1);

namespace App\Services;

use App\DTOs\PatientFilterDTO;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

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

    /**
     * Create multiple patients in a single transaction. All succeed or all roll back.
     *
     * @param  array<int, array<string, mixed>>  $patients  Validated patient data per index
     * @return int Number of patients created
     *
     * @throws \Throwable On first failure (e.g. duplicate id_number), transaction is rolled back
     */
    public function createPatientsBulk(User $user, array $patients): int
    {
        return (int) DB::transaction(function () use ($user, $patients): int {
            $count = 0;
            foreach ($patients as $data) {
                $user->patients()->create($data);
                $count++;
            }

            return $count;
        });
    }

    public function updatePatient(Patient $patient, array $data): bool
    {
        return $patient->update($data);
    }

    public function deletePatient(Patient $patient): bool
    {
        return $patient->delete();
    }

    private function buildQuery(User $user, PatientFilterDTO $filters): HasMany
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
