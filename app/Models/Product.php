<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory; // <-- ADD THIS LINE

    protected $fillable = [
        'sku',
        'name',
        'description',
        'category_id',
        'barcode',
        'unit',
        'reorder_level',
        'cost_price',
        'sell_price',
        'is_active'
    ];
}
