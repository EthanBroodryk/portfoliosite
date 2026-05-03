<?php

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
    Schema::table('job_cards', function (Blueprint $table) {
        $table->string('engine_serial_nr')->nullable();
        $table->string('engine_model_nr')->nullable();
        $table->string('run_hours')->nullable();
    });
}

public function down(): void
{
    Schema::table('job_cards', function (Blueprint $table) {
        $table->dropColumn([
            'engine_serial_nr',
            'engine_model_nr',
            'run_hours',
        ]);
    });
}
};
