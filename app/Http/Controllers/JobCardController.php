<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\JobCard;

class JobCardController extends Controller
{
    // Show all job cards
    public function index()
    {
        return Inertia::render('JobCards/Index');
    }

    // Show create form
    public function create()
    {
        return Inertia::render('JobCards/Create');
    }

    // Store new job card


public function store(Request $request)
{

    //dd($request);
    $validated = $request->validate([
        'date' => 'required',
        'technician' => 'nullable',
        'customer_order_no' => 'nullable',
        'to' => 'nullable',
        'call_out_time' => 'nullable',
        'start_time' => 'nullable',
        'end_time' => 'nullable',
        'email' => 'nullable|email',
        'tel' => 'nullable',
        'description' => 'nullable',
    ]);

    $jobCard = JobCard::create(array_merge($validated, [
        'job_number' => $this->generateJobNumber(),
    ]));

    return redirect()->route('jobcards.index');
}

private function generateJobNumber()
{
    $lastId = JobCard::max('id') + 1;
    return 'JC-' . str_pad($lastId, 6, '0', STR_PAD_LEFT);
}
}