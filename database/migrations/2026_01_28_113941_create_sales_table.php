<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // $table->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedBigInteger('customer_id')->nullable();
// $table->foreign('customer_id')->references('id')->on('customers')->onDelete('set null');

            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax', 10, 2);
            $table->decimal('discount', 10, 2);
            $table->decimal('total', 10, 2);
            $table->decimal('amount_received', 10, 2);
            $table->decimal('change_due', 10, 2);
            $table->string('payment_method');
            $table->string('status');
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
