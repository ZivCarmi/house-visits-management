<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\FeedingType;
use App\Enums\FollowUpFrequency;
use App\Observers\PatientObserver;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'latitude',
        'longitude',
        'phone',
        'feeding_type',
        'last_visit_date',
        'followup_frequency',
        'next_visit_date',
        'notes',
    ];

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'feeding_type' => FeedingType::class,
            'followup_frequency' => FollowUpFrequency::class,
            'last_visit_date' => 'date',
            'next_visit_date' => 'date',
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (is_string($search) && $search !== '' && preg_match('/^\d+$/', $search)) {
            $query->where('id_number', 'like', '%'.$search.'%');
        }

        return $query;
    }

    public function scopeWeeklyVisits(Builder $query, string $timezone = 'Asia/Jerusalem'): Builder
    {
        $today = Carbon::today($timezone);

        return $query->whereBetween('next_visit_date', [
            $today->copy()->subDays($today->dayOfWeek)->startOfDay(),
            $today->copy()->subDays($today->dayOfWeek)->addDays(6)->endOfDay(),
        ]);
    }

    public function scopeMonthlyVisits(Builder $query, string $timezone = 'Asia/Jerusalem'): Builder
    {
        $today = Carbon::today($timezone);

        return $query->whereBetween('next_visit_date', [
            $today->copy()->startOfMonth(),
            $today->copy()->endOfMonth(),
        ]);
    }

    public function scopeOverdueVisits(Builder $query, string $timezone = 'Asia/Jerusalem'): Builder
    {
        $today = Carbon::today($timezone);

        return $query->whereDate('next_visit_date', '<', $today);
    }

    public function scopeSortBy(Builder $query, string $column = 'id', string $direction = 'desc'): Builder
    {
        $validColumns = ['id', 'last_visit_date', 'next_visit_date'];
        $column = in_array($column, $validColumns, true) ? $column : 'id';

        $validDirections = ['asc', 'desc'];
        $direction = in_array(strtolower($direction), $validDirections, true) ? strtolower($direction) : 'desc';

        return $query->orderBy($column, $direction);
    }
}
