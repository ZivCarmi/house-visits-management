<?php

return [
    'attributes' => [
        'first_name' => 'שם פרטי',
        'last_name' => 'שם משפחה',
        'email' => 'אימייל',
        'password' => 'סיסמה',
        'password_confirmation' => 'אימות סיסמה',
        'current_password' => 'סיסמה נוכחית',
        'token' => 'אסימון',
    ],
    'required' => 'השדה :attribute הוא חובה.',
    'string' => 'השדה :attribute חייב להיות מחרוזת.',
    'min' => [
        'string' => 'השדה :attribute חייב להכיל לפחות :min תווים.',
        'array' => 'השדה :attribute חייב להכיל לפחות :min פריטים.',
    ],
    'max' => [
        'string' => 'השדה :attribute לא יכול להכיל יותר מ־:max תווים.',
        'array' => 'השדה :attribute לא יכול להכיל יותר מ־:max פריטים.',
    ],
    'unique' => 'הערך בשדה :attribute כבר קיים במערכת.',
    'custom' => [
        'email' => [
            'unique' => 'כבר קיים משתמש עם אימייל זהה.',
        ],
    ],
    'email' => 'השדה :attribute חייב להיות כתובת אימייל תקינה.',
    'password' => 'סיסמה חייבת להכיל לפחות 8 תווים.',
    'confirmed' => 'השדה אימות :attribute לא תואם.',
    'current_password' => 'הסיסמה הנוכחית שגויה.',
];
