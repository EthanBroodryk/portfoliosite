<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('checkins', function (Blueprint $table) {
            $table->id();

            // relationships
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('job_card_id')->constrained()->onDelete('cascade');

            // geo tracking
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->decimal('accuracy', 8, 2)->nullable();

            // time tracking
            $table->timestamp('checked_in_at')->nullable();

            // optional: action type (future-proof)
            $table->string('type')->default('start'); 
            // start, pause, resume, complete

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('checkins');
    }
};