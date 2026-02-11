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
    Schema::table('stock_movements', function (Blueprint $table) {
        $table->unsignedBigInteger('branch_id')->nullable()->after('performed_by');

        // If you have a branches table:
        $table->foreign('branch_id')->references('id')->on('branches')->onDelete('set null');
    });
}

public function down()
{
    Schema::table('stock_movements', function (Blueprint $table) {
        $table->dropForeign(['branch_id']);
        $table->dropColumn('branch_id');
    });
}

};
