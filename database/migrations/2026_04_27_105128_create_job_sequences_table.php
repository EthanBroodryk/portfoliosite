<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('job_sequences', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('last_number')->default(100000); // one before first
            $table->timestamps();
        });

        // Insert initial sequence row
        DB::table('job_sequences')->insert([
            'last_number' => 100000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('job_sequences');
    }
 
};
