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
            $table->string('call_out')->nullable();
            $table->decimal('labour_hours', 5, 2)->nullable();
            $table->integer('travel_km')->nullable();
            $table->text('remarks')->nullable();
            $table->string('client_name')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_cards', function (Blueprint $table) {
            //
        });
    }
};
