<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerReturn extends Model
{
    protected $fillable = [
        'receiving_id',
        'branch_id',
        'product_id',
        'quantity',
        'customer_name',
        'customer_contact',
        'return_reason',
        'return_condition',
        'refund_method',
        'sale_reference',
        'invoice_number',
        'notes',
        'received_at'
    ];

    public function receiving()
    {
        return $this->belongsTo(Receiving::class);
    }
}
