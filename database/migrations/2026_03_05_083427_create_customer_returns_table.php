<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customer_returns', function (Blueprint $table) {
            $table->id();

            // relations
            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();

            // customer info
            $table->string('customer_name')->nullable();
            $table->string('customer_contact')->nullable();

            // return details
            $table->integer('quantity');
            $table->text('return_reason')->nullable();
            $table->string('return_condition')->nullable(); // resellable / damaged / repair
            $table->string('refund_method')->nullable(); // cash / card / store_credit / exchange

            // references
            $table->string('sale_reference')->nullable();
            $table->string('invoice_number')->nullable();

            // notes
            $table->text('notes')->nullable();

            // date returned
            $table->date('received_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_returns');
    }
};
