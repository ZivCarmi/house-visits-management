<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\FeedbackType;
use App\Mail\FeedbackSubmitted;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class FeedbackService
{
    public function store(User $user, string $type, string $message): Feedback
    {
        $feedback = $user->feedbacks()->create([
            'type' => FeedbackType::from($type),
            'message' => $message,
        ]);

        $to = config('feedback.email');
        if ($to) {
            Mail::to($to)->send(new FeedbackSubmitted($feedback));
        }

        return $feedback;
    }
}
