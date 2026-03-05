<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CalendarEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        $patient = \App\Models\Patient::find($this->input('patient_id'));

        return $patient && $patient->user_id === auth()->id();
    }

    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'exists:patients,id'],
            'start_datetime' => ['required', 'date_format:Y-m-d H:i'],
            'end_datetime' => ['required', 'date_format:Y-m-d H:i', 'after:start_datetime'],
            'notes' => ['nullable', 'string', 'max:500'],
            'color_id' => ['nullable', 'integer', 'between:1,11'],
        ];
    }

    public function messages(): array
    {
        return [
            'patient_id.required' => 'יש לבחור מטופל',
            'patient_id.exists' => 'המטופל שנבחר אינו קיים במערכת',
            'start_datetime.required' => 'יש להזין תאריך ושעת התחלה',
            'start_datetime.date_format' => 'פורמט התאריך והשעה אינו תקין',
            'end_datetime.required' => 'יש להזין תאריך ושעת סיום',
            'end_datetime.date_format' => 'פורמט התאריך והשעה אינו תקין',
            'end_datetime.after' => 'שעת הסיום חייבת להיות אחרי שעת ההתחלה',
            'notes.max' => 'ההערות לא יכולות להכיל יותר מ-500 תווים',
            'color_id.between' => 'יש לבחור צבע תקין',
        ];
    }
}
