<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobCardPhoto extends Model
{
    protected $fillable = ['job_card_id', 'path', 'type'];

    public function jobCard()
    {
        return $this->belongsTo(JobCard::class);
    }
}