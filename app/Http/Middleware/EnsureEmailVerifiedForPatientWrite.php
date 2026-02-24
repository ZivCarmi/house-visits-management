<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailVerifiedForPatientWrite
{
    /**
     * Handle an incoming request. Redirect unverified users when they attempt to create or edit patients.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()->hasVerifiedEmail()) {
            return $next($request);
        }

        $message = __('Verify your email to add or edit patients.');

        if ($request->expectsJson()) {
            return response()->json(['message' => $message], 403);
        }

        return $request->isMethod('GET')
            ? redirect()->route('patients.index')->with('error', $message)
            : redirect()->back()->with('error', $message);
    }
}
