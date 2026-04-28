<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Checkin extends Model
{
    protected $fillable = [
        'user_id',
        'job_card_id',
        'latitude',
        'longitude',
        'accuracy',
        'checked_in_at',
        'type',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobCard()
    {
        return $this->belongsTo(JobCard::class);
    }

    public function checkins()
    {
        return $this->hasMany(Checkin::class);
    }
}