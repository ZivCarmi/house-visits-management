<?php

declare(strict_types=1);

namespace App\Enums;

enum FollowUpFrequency: string
{
    case Weekly = 'weekly';
    case Biweekly = 'biweekly';
    case Monthly = 'monthly';
    case Bimonthly = 'bimonthly';
    case Quarterly = 'quarterly';
    case Semiannual = 'semiannual';
    case None = 'none';
}
