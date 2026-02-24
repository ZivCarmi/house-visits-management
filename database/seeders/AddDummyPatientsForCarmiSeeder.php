<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Seeder;

class AddDummyPatientsForCarmiSeeder extends Seeder
{
    /**
     * Add 2 dummy patients for the user carmi.ziv1@gmail.com.
     */
    public function run(): void
    {
        $user = User::query()->where('email', 'carmi.ziv1@gmail.com')->first();

        if (! $user) {
            $this->command->warn('User with email carmi.ziv1@gmail.com not found. Skipping.');

            return;
        }

        Patient::factory()->count(2)->for($user)->create();
        $this->command->info('Created 2 dummy patients for '.$user->email);
    }
}
