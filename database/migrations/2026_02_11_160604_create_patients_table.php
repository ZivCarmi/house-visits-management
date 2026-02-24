<?php

declare(strict_types=1);

use App\Enums\FeedingType;
use App\Enums\FollowUpFrequency;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('full_name', 255);
            $table->string('id_number', 9);
            $table->string('address', 255);
            $table->string('phone', 20);
            $table->string('feeding_type')->default(FeedingType::PO->value);
            $table->date('last_visit_date');
            $table->string('followup_frequency')->default(FollowupFrequency::Weekly->value);
            $table->date('next_visit_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'id_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
