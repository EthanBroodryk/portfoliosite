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
    Schema::create('products', function (Blueprint $table) {
        $table->id();

        // Core product fields
        $table->string('sku')->unique();
        $table->string('name');
        $table->text('description')->nullable();

        // Optional but helpful
        $table->unsignedBigInteger('category_id')->nullable();
        $table->string('barcode')->nullable();

        // Inventory fields
        $table->string('unit')->default('pcs');  
        $table->integer('reorder_level')->default(0);

        // Pricing
        $table->decimal('cost_price', 10, 2)->default(0);
        $table->decimal('sell_price', 10, 2)->default(0);

        $table->boolean('is_active')->default(true);

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
