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
        'cost_per_unit',
    ];

    protected $casts = [
        'movement_date' => 'datetime',
        'quantity' => 'decimal:2',
        'cost_per_unit' => 'decimal:2',
    ];
}
