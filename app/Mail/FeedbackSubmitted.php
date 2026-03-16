<?php

declare(strict_types=1);

namespace App\Mail;

use App\Enums\FeedbackType;
use App\Models\Feedback;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FeedbackSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public string $typeLabel;

    public function __construct(
        public Feedback $feedback
    ) {
        $this->typeLabel = $this->typeLabelFor($feedback->type);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'משוב חדש: '.$this->typeLabel,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.feedback-submitted',
        );
    }

    /**
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    private function typeLabelFor(FeedbackType $type): string
    {
        return match ($type) {
            FeedbackType::FeatureIdea => 'רעיון לפיצ׳ר',
            FeedbackType::Bug => 'באג',
            FeedbackType::Unclear => 'משהו לא ברור',
            FeedbackType::Other => 'אחר',
        };
    }
}
