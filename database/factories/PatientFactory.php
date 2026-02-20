<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\FeedingType;
use App\Enums\FollowUpFrequency;
use App\Models\Patient;
use Carbon\CarbonImmutable;
use Faker\Factory as FakerFactory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Patient>
 */
class PatientFactory extends Factory
{
    protected $model = Patient::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $lastVisit = fake()->dateTimeBetween('-6 months', 'now');
        $lastDate = CarbonImmutable::parse($lastVisit);
        $feedingType = fake()->randomElement(FeedingType::cases());
        $frequency = fake()->randomElement(FollowUpFrequency::cases());

        $nextDate = match ($frequency) {
            FollowUpFrequency::Weekly => $lastDate->addDays(7),
            FollowUpFrequency::Biweekly => $lastDate->addDays(14),
            FollowUpFrequency::Monthly => $lastDate->addMonth(),
            FollowUpFrequency::Bimonthly => $lastDate->addMonths(2),
            FollowUpFrequency::Quarterly => $lastDate->addMonths(3),
            FollowUpFrequency::Semiannual => $lastDate->addMonths(6),
        };

        $useHebrew = fake()->boolean(50);
        $hebrewFaker = $useHebrew ? FakerFactory::create('he_IL') : null;

        $fullName = $useHebrew && $hebrewFaker
            ? $hebrewFaker->name()
            : fake()->name();
        $address = $useHebrew && $hebrewFaker
            ? $hebrewFaker->streetAddress().', '.$hebrewFaker->city()
            : fake()->streetAddress().', '.fake()->city();
        $notes = $useHebrew && $hebrewFaker
            ? $hebrewFaker->optional(0.3)->sentence()
            : fake()->optional(0.3)->sentence();

        return [
            'full_name' => $fullName,
            'id_number' => (string) fake()->unique()->numberBetween(100000000, 999999999),
            'address' => $address,
            'phone' => (string) fake()->numerify('05########'),
            'feeding_type' => $feedingType,
            'last_visit_date' => $lastDate->format('Y-m-d'),
            'followup_frequency' => $frequency,
            'next_visit_date' => $nextDate->format('Y-m-d'),
            'notes' => $notes,
        ];
    }
}
