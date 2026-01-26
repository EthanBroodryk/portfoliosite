<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('sale_id')->constrained('sales')->onDelete('cascade'); // Links to sale
            $table->foreignId('product_id')->constrained()->onDelete('restrict');   // Links to product

            $table->integer('quantity');       // How many units
            $table->decimal('unit_price', 10, 2); // Price per unit
            $table->decimal('total', 10, 2);      // quantity * unit_price

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_items');
    }
};
