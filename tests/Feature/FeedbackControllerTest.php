<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\FeedbackType;
use App\Mail\FeedbackSubmitted;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class FeedbackControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_submit_feedback(): void
    {
        $response = $this->post(route('feedback.store'), [
            'type' => FeedbackType::FeatureIdea->value,
            'message' => 'Test feedback',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('feedback', 0);
    }

    public function test_authenticated_user_can_submit_feedback(): void
    {
        Mail::fake();

        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('feedback.store'), [
            'type' => FeedbackType::Bug->value,
            'message' => 'Something is broken',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('status');

        $this->assertDatabaseCount('feedback', 1);
        $feedback = Feedback::first();
        $this->assertSame($user->id, $feedback->user_id);
        $this->assertSame(FeedbackType::Bug, $feedback->type);
        $this->assertSame('Something is broken', $feedback->message);

        Mail::assertSent(FeedbackSubmitted::class, fn ($mailable) => $mailable->feedback->id === $feedback->id);
    }

    public function test_validation_requires_type_and_message(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('feedback.store'), [
            'type' => '',
            'message' => '',
        ]);

        $response->assertSessionHasErrors(['type', 'message']);
        $this->assertDatabaseCount('feedback', 0);
    }

    public function test_validation_requires_message_min_length(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('feedback.store'), [
            'type' => FeedbackType::Other->value,
            'message' => 'short',
        ]);

        $response->assertSessionHasErrors(['message']);
        $this->assertDatabaseCount('feedback', 0);
    }
}
