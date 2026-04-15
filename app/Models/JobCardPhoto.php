<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobCardPhoto extends Model
{
    protected $fillable = [
        'job_card_id',
        'path',
    ];
}