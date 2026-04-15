<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\JobCard;
use App\Models\User;
use App\Models\JobCardPhoto;
use Illuminate\Support\Facades\Storage;

class JobCardController extends Controller
{


public function sign(Request $request, JobCard $jobCard)
{
    $request->validate([
        'signature' => 'required|string',
    ]);

    $image = $request->signature;

    $image = str_replace('data:image/png;base64,', '', $image);
    $image = str_replace(' ', '+', $image);

    $fileName = 'signature_' . $jobCard->id . '_' . time() . '.png';

    $path = 'signatures/' . $fileName;

    \Storage::disk('public')->put(
        $path,
        base64_decode($image)
    );

    // 🔥 IMPORTANT: assign then save
    $jobCard->signature = $path;
    $jobCard->save();

    return back();
}

public function update(Request $request, JobCard $jobCard)
{
    $jobCard->update($request->all());

    return back()->with('success', 'Job updated successfully');
}


public function deletePhoto(JobCardPhoto $photo)
{
    // delete file from storage
    if (Storage::disk('public')->exists($photo->path)) {
        Storage::disk('public')->delete($photo->path);
    }

    // delete from DB
    $photo->delete();

    return back()->with('success', 'Photo deleted');
}

public function uploadBeforePhotos(Request $request, $id)
{
    $request->validate([
        'photos.*' => 'required|image|max:4096',
    ]);

    foreach ($request->file('photos') as $photo) {
        $path = $photo->store('before-photos', 'public');

        \App\Models\JobCardPhoto::create([
            'job_card_id' => $id,
            'path' => $path,
        ]);
    }

    return back()->with('success', 'Photos uploaded');
}

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




public function show(JobCard $jobCard)
{
    $jobCard->load('photos');

    return inertia('JobCards/Show', [
        'job' => $jobCard,
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