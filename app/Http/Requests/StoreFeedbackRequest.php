<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\FeedbackType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class StoreFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', new Enum(FeedbackType::class)],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type.required' => 'יש לבחור סוג משוב',
            'type.enum' => 'יש לבחור סוג משוב תקין',
            'message.required' => 'יש להזין תיאור',
            'message.min' => 'התיאור חייב להכיל לפחות 10 תווים',
            'message.max' => 'התיאור יכול להכיל עד 2000 תווים',
        ];
    }
}
