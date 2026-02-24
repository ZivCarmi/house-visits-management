<?php

declare(strict_types=1);

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

    Route::resource('patients', PatientController::class)
        ->only(['index', 'create', 'store', 'edit', 'update', 'destroy'])
        ->middlewareFor(
            ['create', 'store', 'edit', 'update', 'destroy'],
            'verified.patients.write'
        );
});

require __DIR__.'/auth.php';
