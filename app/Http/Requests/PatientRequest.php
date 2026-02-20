<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\FeedingType;
use App\Enums\FollowUpFrequency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class PatientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'id_number' => [
                'required',
                'string',
                'max:9',
                'regex:/^\d+$/',
                Rule::unique('patients', 'id_number')->ignore($this->patient),
            ],
            'address' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20', 'regex:/^\d+$/'],
            'feeding_type' => ['required', new Enum(FeedingType::class)],
            'last_visit_date' => ['required', 'date'],
            'followup_frequency' => ['required', new Enum(FollowUpFrequency::class)],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * Get custom validation messages (Hebrew, user-friendly).
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'full_name.required' => 'יש להזין שם מטופל',
            'full_name.max' => 'שם המטופל יכול להכיל עד 255 תווים',
            'id_number.required' => 'יש להזין מספר תעודת זהות',
            'id_number.max' => 'מספר תעודת זהות יכול להכיל עד 9 ספרות',
            'id_number.regex' => 'מספר תעודת זהות יכול להכיל ספרות בלבד',
            'id_number.unique' => 'כבר קיים מטופל עם מספר תעודת זהות זהה',
            'address.required' => 'יש להזין כתובת',
            'address.max' => 'כתובת יכולה להכיל עד 255 תווים',
            'phone.required' => 'יש להזין מספר טלפון',
            'phone.max' => 'מספר טלפון יכול להכיל עד 20 תווים',
            'phone.regex' => 'מספר טלפון יכול להכיל ספרות בלבד',
            'feeding_type.required' => 'יש לבחור סוג ההזנה',
            'feeding_type.enum' => 'יש לבחור סוג הזנה תקין',
            'last_visit_date.required' => 'יש לבחור תאריך ביקור אחרון',
            'last_visit_date.date' => 'יש להזין תאריך תקין',
            'followup_frequency.required' => 'יש לבחור תדירות מעקב',
            'followup_frequency.enum' => 'יש לבחור תדירות מעקב תקינה',
        ];
    }
}
