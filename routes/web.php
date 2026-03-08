<?php

declare(strict_types=1);

use App\Http\Controllers\GoogleCalendarController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProfileController;
use App\Models\Patient;
use Illuminate\Support\Facades\Route;

Route::bind('patient', function (string $value) {
    return Patient::where('user_id', auth()->id())->findOrFail($value);
});

Route::middleware('auth')->group(function (): void {
    Route::get('/', [HomeController::class, 'index'])->name('home');
    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('patients/bulk', [PatientController::class, 'storeBulk'])
        ->name('patients.bulk.store')
        ->middleware('verified.patients.write');

    Route::resource('patients', PatientController::class)
        ->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
        ->middlewareFor(
            ['create', 'store', 'edit', 'update', 'destroy'],
            'verified.patients.write'
        );

    Route::prefix('google-calendar')->name('google-calendar.')->group(function (): void {
        Route::get('connect', [GoogleCalendarController::class, 'connect'])->name('connect');
        Route::get('callback', [GoogleCalendarController::class, 'callback'])->name('callback');
        Route::post('events', [GoogleCalendarController::class, 'createEvent'])->name('events.store');
        Route::delete('disconnect', [GoogleCalendarController::class, 'disconnect'])->name('disconnect');
        Route::get('status', [GoogleCalendarController::class, 'status'])->name('status');
    });
});

require __DIR__.'/auth.php';
