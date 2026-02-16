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
    Schema::create('suppliers', function (Blueprint $table) {
        $table->id();
        
        // Basic info
        $table->string('name');
        $table->string('contact_name')->nullable();
        $table->string('email')->nullable();
        $table->string('phone')->nullable();
        $table->string('website')->nullable();

        // Address
        $table->string('address_line1')->nullable();
        $table->string('address_line2')->nullable();
        $table->string('city')->nullable();
        $table->string('province')->nullable();
        $table->string('postal_code')->nullable();
        $table->string('country')->nullable();

        // Accounting
        $table->string('vat_number')->nullable();
        $table->string('account_number')->nullable();
        $table->string('payment_terms')->nullable(); // e.g., NET30

        // System
        $table->boolean('is_active')->default(true);

        // Audit trail
        $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
        $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
