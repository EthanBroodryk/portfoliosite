<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();

            // Type of movement (Goods Issue, Goods Receipt, Transfer, etc.)
            $table->string('type');

            // Product identification
            $table->string('sku');

            // Quantity moved (+ or -)
            $table->decimal('quantity', 10, 2);

            // From and To locations (warehouse/bin/customer/etc.)
            $table->string('from_location')->nullable();
            $table->string('to_location')->nullable();

            // Datetime of movement
            $table->timestamp('movement_date');

            // External reference (Sales Order #, Purchase Order #, etc.)
            $table->string('reference')->nullable();

            // User who performed it (store user_id if needed)
            $table->string('performed_by');

            // Cost per unit
            $table->decimal('cost_per_unit', 10, 2)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
