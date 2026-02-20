<?php

declare(strict_types=1);

namespace App\Enums;

enum FeedingType: string
{
    case PO = 'PO';
    case PEG = 'PEG';
    case PEJ = 'PEJ';
    case PZ = 'PZ';
    case TPN = 'TPN';
}
