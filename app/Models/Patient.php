<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\FeedingType;
use App\Enums\FollowUpFrequency;
use App\Observers\PatientObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy(PatientObserver::class)]
class Patient extends Model
{
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'full_name',
        'id_number',
        'address',
        'phone',
        'feeding_type',
        'last_visit_date',
        'followup_frequency',
        'next_visit_date',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'feeding_type' => FeedingType::class,
            'followup_frequency' => FollowUpFrequency::class,
            'last_visit_date' => 'date',
            'next_visit_date' => 'date',
        ];
    }
}
