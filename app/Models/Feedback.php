<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\FeedbackType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Feedback extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'message',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => FeedbackType::class,
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
