<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Supplier extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact_name',
        'email',
        'phone',
        'website',
        'address_line1',
        'address_line2',
        'city',
        'province',
        'postal_code',
        'country',
        'vat_number',
        'account_number',
        'payment_terms',
        'is_active',
        'created_by',
        'updated_by'
    ];

    // Relationships
    public function receivings()
    {
        return $this->hasMany(Receiving::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
