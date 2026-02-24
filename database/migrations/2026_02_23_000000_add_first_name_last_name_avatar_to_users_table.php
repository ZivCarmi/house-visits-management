<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('first_name')->default('')->after('google_id');
            $table->string('last_name')->default('')->after('first_name');
            $table->string('avatar')->nullable()->after('last_name');
        });

        foreach (DB::table('users')->get() as $row) {
            $name = (string) ($row->name ?? '');
            $parts = explode(' ', $name, 2);
            DB::table('users')->where('id', $row->id)->update([
                'first_name' => $parts[0] ?? '',
                'last_name' => $parts[1] ?? '',
            ]);
        }

        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('name')->after('google_id');
        });

        foreach (DB::table('users')->get() as $row) {
            $name = trim(($row->first_name ?? '').' '.($row->last_name ?? ''));
            DB::table('users')->where('id', $row->id)->update(['name' => $name]);
        }

        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn(['first_name', 'last_name', 'avatar']);
        });
    }
};
