<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'user_id',
        'customer_id',
        'subtotal',
        'tax',
        'discount',
        'total',
        'amount_received',
        'change_due',
        'payment_method',
        'status',
        'note',
    ];

    // Relationship to sale items
    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }

    // Relationship to cashier/user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Optional customer relationship
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
