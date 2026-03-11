<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PatientLocationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $ids = $this->input('ids');
        if (is_string($ids)) {
            $this->merge([
                'ids' => array_values(array_filter(array_map('intval', explode(',', $ids)))),
            ]);
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ids' => ['required', 'array', 'max:15'],
            'ids.*' => ['integer', 'min:1'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ids.required' => 'יש לבחור לפחות מטופל אחד.',
            'ids.max' => 'ניתן לבחור עד 15 מטופלים בלבד להצגה במפה.',
        ];
    }
}
