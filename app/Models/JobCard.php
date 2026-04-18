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
        'status',
        'signature',
        'branch_id',
    ];

    public function photos()
    {
        return $this->hasMany(JobCardPhoto::class, 'job_card_id');
    }

    public function beforePhotos()
    {
        return $this->hasMany(JobCardPhoto::class, 'job_card_id')
            ->where('type', 'before');
    }

    public function afterPhotos()
    {
        return $this->hasMany(JobCardPhoto::class, 'job_card_id')
            ->where('type', 'after');
    }

    public function branch()
{
    return $this->belongsTo(Branch::class);
}
}
