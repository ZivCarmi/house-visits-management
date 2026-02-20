<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\FollowUpFrequency;
use Carbon\CarbonImmutable;

class VisitCalculationService
{
    public function calculateNextVisitDate(CarbonImmutable $lastVisitDate, FollowUpFrequency $frequency): CarbonImmutable
    {
        return match ($frequency) {
            FollowUpFrequency::Weekly => $lastVisitDate->addDays(7),
            FollowUpFrequency::Biweekly => $lastVisitDate->addDays(14),
            FollowUpFrequency::Monthly => $lastVisitDate->addMonth(),
            FollowUpFrequency::Bimonthly => $lastVisitDate->addMonths(2),
            FollowUpFrequency::Quarterly => $lastVisitDate->addMonths(3),
            FollowUpFrequency::Semiannual => $lastVisitDate->addMonths(6),
        };
    }
}
