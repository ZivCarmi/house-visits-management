<?php

declare(strict_types=1);

namespace App\Observers;

use App\Models\Patient;
use App\Services\VisitCalculationService;
use Carbon\CarbonImmutable;

class PatientObserver
{
    public function __construct(
        private VisitCalculationService $visitCalculationService
    ) {}

    public function creating(Patient $patient): void
    {
        if (auth()->check() && $patient->user_id === null) {
            $patient->user_id = auth()->id();
        }

        $this->setNextVisitDate($patient);
    }

    public function updating(Patient $patient): void
    {
        $dirty = $patient->getDirty();
        if (! array_key_exists('last_visit_date', $dirty) && ! array_key_exists('followup_frequency', $dirty)) {
            return;
        }

        $this->setNextVisitDate($patient);
    }

    private function setNextVisitDate(Patient $patient): void
    {
        $lastVisitDate = $patient->last_visit_date;
        $frequency = $patient->followup_frequency;

        if ($lastVisitDate === null || $frequency === null) {
            $patient->next_visit_date = null;

            return;
        }

        $lastImmutable = $lastVisitDate instanceof CarbonImmutable
            ? $lastVisitDate
            : CarbonImmutable::instance($lastVisitDate);

        $patient->next_visit_date = $this->visitCalculationService->calculateNextVisitDate(
            $lastImmutable,
            $frequency
        );
    }

    /**
     * Handle the Patient "deleted" event.
     */
    public function deleted(Patient $patient): void
    {
        //
    }

    /**
     * Handle the Patient "restored" event.
     */
    public function restored(Patient $patient): void
    {
        //
    }

    /**
     * Handle the Patient "force deleted" event.
     */
    public function forceDeleted(Patient $patient): void
    {
        //
    }
}
