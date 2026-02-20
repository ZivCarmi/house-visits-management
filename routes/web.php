<?php

declare(strict_types=1);

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PatientController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::resource('patients', PatientController::class)
    ->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
