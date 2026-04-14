<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_cards', function (Blueprint $table) {
            $table->id(); // unique ID (primary key)

            // Optional readable job card number (recommended)
            $table->string('job_number')->unique();

            $table->date('date');

            $table->string('technician')->nullable();

            $table->string('customer_order_no')->nullable();

            $table->string('to')->nullable();

            $table->time('call_out_time')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();

            $table->string('email')->nullable();
            $table->string('tel')->nullable();

            $table->text('description')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_cards');
    }
};