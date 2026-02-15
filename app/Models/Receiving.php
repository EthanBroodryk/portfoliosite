<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Receiving extends Model
{
    // Link to existing table
    protected $table = 'stock_movements';

    protected $fillable = [
        'product_id',
        'quantity',
        'movement_type',
        'from_type',
        'from_id',
        'to_type',
        'to_id',
        'reference_id',
        'performed_by',
        'notes',
    ];

    /*
     |--------------------------------------------------------------------------
     | RELATIONSHIPS
     |--------------------------------------------------------------------------
    */

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function performedByUser()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }

    // Source (supplier / warehouse / branch)
    public function from()
    {
        return $this->morphTo(__FUNCTION__, 'from_type', 'from_id');
    }

    // Destination (warehouse / branch)
    public function to()
    {
        return $this->morphTo(__FUNCTION__, 'to_type', 'to_id');
    }

    /*
     |--------------------------------------------------------------------------
     | SCOPES
     |--------------------------------------------------------------------------
    */

    /**
     * Scope only receiving movements.
     */
    public function scopeReceiving(Builder $query): Builder
    {
        return $query->whereIn('movement_type', [
            'purchase_receive',
            'warehouse_to_branch_receive',
            'branch_to_branch_receive',
            'customer_return_receive',
            'adjustment_in',
        ]);
    }
}
