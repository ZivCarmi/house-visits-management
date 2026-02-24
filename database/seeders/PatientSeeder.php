<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(?User $user = null): void
    {
        $userId = $user?->id ?? User::first()?->id ?? User::factory()->create()->id;

        Patient::factory(30)->create([
            'user_id' => $userId,
        ]);
    }
}
