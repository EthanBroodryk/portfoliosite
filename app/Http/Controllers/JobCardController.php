<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\JobCard;
use App\Models\User;
use App\Models\JobCardPhoto;

class JobCardController extends Controller
{

public function storeBeforePhotos(Request $request, $id)
{
    $request->validate([
        'photos.*' => ['required', 'image', 'max:5120'],
    ]);

    foreach ($request->file('photos') as $photo) {
        $path = $photo->store('before-photos', 'public');

        JobCardPhoto::create([
            'job_card_id' => $id,
            'path' => $path,
        ]);
    }

    return back()->with('success', 'Photos uploaded');
}
    public function myJobs()
    {
        $user = auth()->user();
        $jobs = \App\Models\JobCard::where('technician', $user->name)->get();
        //dd($jobs);
        return Inertia::render('JobCards/MyJobs', [
            'jobcards' => $jobs
        ]);
    }

        public function sign(Request $request, JobCard $jobCard)
        {
            $request->validate([
            'signature' => 'required|string'
            ]);

            $jobCard->update([
            'signature' => $request->signature,
            'status' => 'completed'
            ]);

            return back();
        }


    public function show(JobCard $jobCard)
    {
        return Inertia::render('JobCards/Show', [
            'job' => $jobCard
        ]);
    }




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
        'status' => 'nullable|in:pending,in_progress,completed',
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