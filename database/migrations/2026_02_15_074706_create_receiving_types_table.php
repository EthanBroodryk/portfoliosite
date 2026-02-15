<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receiving_types', function (Blueprint $table) {
            $table->id();

            $table->string('name')->unique(); 
            // Example: "purchase_receive"

            $table->string('label');
            // Example: "Purchase Receive" (for dropdowns)

            $table->text('description')->nullable();
            // Example: "Receiving stock into the warehouse from suppliers"

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receiving_types');
    }
};
