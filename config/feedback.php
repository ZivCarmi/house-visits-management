<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Feedback notification email
    |--------------------------------------------------------------------------
    |
    | New feedback submissions are sent to this address. Set FEEDBACK_EMAIL
    | in your .env; if unset, MAIL_FROM_ADDRESS is used as fallback.
    |
    */

    'email' => env('FEEDBACK_EMAIL', env('MAIL_FROM_ADDRESS')),
];
