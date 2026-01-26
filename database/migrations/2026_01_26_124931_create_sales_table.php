<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();

            // Invoice number (human readable)
            $table->string('invoice_number')->unique();

            // Cashier
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Optional customer (B2B, loyalty)
            //$table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedBigInteger('customer_id')->nullable();


            // Monetary values
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total', 10, 2);

            // Payments
            $table->decimal('amount_received', 10, 2)->nullable();
            $table->decimal('change_due', 10, 2)->nullable();
            $table->string('payment_method'); // cash / card / eft / mixed

            // Optional metadata
            $table->string('status')->default('completed'); // completed / refunded / void
            $table->string('note')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
