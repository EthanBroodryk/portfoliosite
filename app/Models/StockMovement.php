<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    protected $fillable = [
        'type',
        'sku',
        'quantity',
        'from_location',
        'to_location',
        'movement_date',
        'reference',
        'performed_by',
        'branch_id',
        'cost_per_unit',
    ];

    protected $casts = [
        'movement_date' => 'datetime',
        'quantity' => 'decimal:2',
        'cost_per_unit' => 'decimal:2',
    ];
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function performedByUser()
    {
        return $this->belongsTo(\App\Models\User::class, 'performed_by');
    }

}
