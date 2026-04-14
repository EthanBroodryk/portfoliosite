<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\JobCard;
use App\Models\User;

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
        $technicians = User::where('user_role', 'technician')
            ->select('id', 'name')
            ->get();

        return Inertia::render('JobCards/Create', [
            'technicians' => $technicians,
        ]);
    }

    // Store new job card


public function store(Request $request)
{

    //dd($request);
    $validated = $request->validate([
        'date' => 'required',
        'technician' => 'nullable|string',
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

    return redirect()->route('jobcards.create');
}

private function generateJobNumber()
{
    $lastId = JobCard::max('id') + 1;
    return 'JC-' . str_pad($lastId, 6, '0', STR_PAD_LEFT);
}
}