<?php

declare(strict_types=1);

namespace App\Enums;

enum FeedbackType: string
{
    case FeatureIdea = 'feature_idea';
    case Bug = 'bug';
    case Unclear = 'unclear';
    case Other = 'other';
}
