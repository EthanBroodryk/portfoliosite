<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReceivingType extends Model
{
    protected $fillable = [
        'name',
        'label',
        'description',
        'is_active',
    ];

    // Optional relationship (if receivings table links to receiving_types)
    public function receivings()
    {
        return $this->hasMany(Receiving::class, 'receiving_type_id');
    }
}
