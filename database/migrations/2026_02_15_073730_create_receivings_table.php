<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receivings', function (Blueprint $table) {
            $table->id();

            // Product receiving
            $table->foreignId('product_id')->constrained();

            // Quantity received
            $table->integer('quantity');

            // Receiving type (supplier, warehouse->branch, branch->branch, returns)
            $table->string('receiving_type', 50);

            // Who sent the stock
            $table->string('from_type')->nullable(); 
            $table->unsignedBigInteger('from_id')->nullable();

            // Where the stock is going
            $table->string('to_type'); 
            $table->unsignedBigInteger('to_id');

            // Optional (links to PO, transfer, RA note)
            $table->unsignedBigInteger('reference_id')->nullable();

            // User who received
            $table->foreignId('received_by')->constrained('users');

            // Extra info (damaged boxes, QC notes, etc.)
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receivings');
    }
};
