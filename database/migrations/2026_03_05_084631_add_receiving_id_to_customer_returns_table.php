<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('customer_returns', function (Blueprint $table) {

            $table->foreignId('receiving_id')
                ->after('id')
                ->constrained('receivings')
                ->cascadeOnDelete();

        });
    }

    public function down(): void
    {
        Schema::table('customer_returns', function (Blueprint $table) {

            $table->dropForeign(['receiving_id']);
            $table->dropColumn('receiving_id');

        });
    }
};;
