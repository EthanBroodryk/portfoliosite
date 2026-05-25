<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    //
    protected $fillable = [
        'client_name',
        'email',
        'invoice_number',
        'amount',
        'description',
        'bank_name',      
        'account_type',   
        'branch_code',    
        'account_number', 
        'logo',
    ];
}
