<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('customers', function (Blueprint $table) {

            // Add missing columns only if they don't exist
            if (!Schema::hasColumn('customers', 'name')) {
                $table->string('name')->after('id');
            }

            if (!Schema::hasColumn('customers', 'email')) {
                $table->string('email')->nullable()->unique()->after('name');
            }

            if (!Schema::hasColumn('customers', 'phone')) {
                $table->string('phone')->nullable()->after('email');
            }

            if (!Schema::hasColumn('customers', 'address')) {
                $table->string('address')->nullable()->after('phone');
            }

            if (!Schema::hasColumn('customers', 'type')) {
                $table->enum('type', ['retail', 'wholesale'])->default('retail')->after('address');
            }

            if (!Schema::hasColumn('customers', 'credit_balance')) {
                $table->decimal('credit_balance', 10, 2)->default(0)->after('type');
            }

            if (!Schema::hasColumn('customers', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    public function down()
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn([
                'name',
                'email',
                'phone',
                'address',
                'type',
                'credit_balance',
                'deleted_at',
            ]);
        });
    }
};