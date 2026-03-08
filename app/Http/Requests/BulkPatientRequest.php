<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\FeedingType;
use App\Enums\FollowUpFrequency;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Validator;

class BulkPatientRequest extends FormRequest
{
    private const MAX_PATIENTS_PER_BULK = 5;

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
            'patients' => ['required', 'array', 'max:'.self::MAX_PATIENTS_PER_BULK],
            'patients.*.full_name' => ['required', 'string', 'max:255'],
            'patients.*.id_number' => [
                'required',
                'string',
                'max:9',
                'regex:/^\d+$/',
                Rule::unique('patients', 'id_number')
                    ->where('user_id', $this->user()->id),
            ],
            'patients.*.address' => ['required', 'string', 'max:255'],
            'patients.*.phone' => ['required', 'string', 'max:20', 'regex:/^\d+$/'],
            'patients.*.feeding_type' => ['required', new Enum(FeedingType::class)],
            'patients.*.last_visit_date' => ['required', 'date'],
            'patients.*.followup_frequency' => ['required', new Enum(FollowUpFrequency::class)],
            'patients.*.notes' => ['nullable', 'string'],
        ];
    }

    /**
     * Configure the validator to reject duplicate id_numbers within the batch.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $patients = $this->input('patients', []);
            $idNumbers = [];
            foreach ($patients as $index => $patient) {
                $id = trim((string) ($patient['id_number'] ?? ''));
                if ($id === '') {
                    continue;
                }
                if (isset($idNumbers[$id])) {
                    $validator->errors()->add(
                        "patients.{$index}.id_number",
                        'מספר תעודת זהות זהה למטופל מספר '.($idNumbers[$id] + 1)
                    );
                } else {
                    $idNumbers[$id] = $index;
                }
            }
        });
    }

    /**
     * Get custom validation messages (Hebrew, user-friendly).
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'patients.required' => 'יש להזין לפחות מטופל אחד',
            'patients.max' => 'ניתן להוסיף עד '.self::MAX_PATIENTS_PER_BULK.' מטופלים בפעולה אחת',
            'patients.*.full_name.required' => 'יש להזין שם מטופל',
            'patients.*.full_name.max' => 'שם המטופל יכול להכיל עד 255 תווים',
            'patients.*.id_number.required' => 'יש להזין מספר תעודת זהות',
            'patients.*.id_number.max' => 'מספר תעודת זהות יכול להכיל עד 9 ספרות',
            'patients.*.id_number.regex' => 'מספר תעודת זהות יכול להכיל ספרות בלבד',
            'patients.*.id_number.unique' => 'כבר קיים מטופל עם מספר תעודת זהות זהה',
            'patients.*.address.required' => 'יש להזין כתובת',
            'patients.*.address.max' => 'כתובת יכולה להכיל עד 255 תווים',
            'patients.*.phone.required' => 'יש להזין מספר טלפון',
            'patients.*.phone.max' => 'מספר טלפון יכול להכיל עד 20 תווים',
            'patients.*.phone.regex' => 'מספר טלפון יכול להכיל ספרות בלבד',
            'patients.*.feeding_type.required' => 'יש לבחור סוג ההזנה',
            'patients.*.feeding_type.enum' => 'יש לבחור סוג הזנה תקין',
            'patients.*.last_visit_date.required' => 'יש לבחור תאריך ביקור אחרון',
            'patients.*.last_visit_date.date' => 'יש להזין תאריך תקין',
            'patients.*.followup_frequency.required' => 'יש לבחור תדירות מעקב',
            'patients.*.followup_frequency.enum' => 'יש לבחור תדירות מעקב תקינה',
        ];
    }
}
