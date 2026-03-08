<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    protected $fillable = [
        'customer_id',
        'quote_number',
        'total',
        'status',
        'valid_until',
        'quote_details'
    ];

    protected $casts = [
        'quote_details' => 'array',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}