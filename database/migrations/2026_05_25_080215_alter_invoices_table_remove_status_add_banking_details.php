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
        Schema::table('invoices', function (Blueprint $table) {
            // 1. Remove the status column
            if (Schema::hasColumn('invoices', 'status')) {
                $table->dropColumn('status');
            }

            // 2. Add the new banking detail columns (nullable just in case)
            $table->string('bank_name')->nullable()->after('amount');
            $table->string('account_type')->nullable()->after('bank_name');
            $table->string('branch_code')->nullable()->after('account_type');
            $table->string('account_number')->nullable()->after('branch_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            // Re-add status if rolled back
            $table->string('status')->default('pending')->after('amount');

            // Drop banking info columns
            $table->dropColumn(['bank_name', 'account_type', 'branch_code', 'account_number']);
        });
    }
};