<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobCard extends Model
{
    protected $fillable = [
        'job_number',
        'date',
        'technician',
        'customer_order_no',
        'to',
        'call_out_time',
        'start_time',
        'end_time',
        'email',
        'tel',
        'description',
    ];
}