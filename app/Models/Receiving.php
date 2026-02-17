<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Receiving extends Model
{
    protected $table = 'receivings';

    protected $fillable = [
        'product_id',
        'quantity',
        'receiving_type',
        'from_type',
        'from_id',
        'to_type',
        'to_id',
        'reference_id',
        'received_by',
        'notes',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function receivedByUser()
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    public function from()
    {
        return $this->morphTo(__FUNCTION__, 'from_type', 'from_id');
    }

    public function to()
    {
        return $this->morphTo(__FUNCTION__, 'to_type', 'to_id');
    }
}
