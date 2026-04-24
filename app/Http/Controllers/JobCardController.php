<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\JobCard;
use App\Models\User;
use App\Models\Branch;
use App\Models\JobCardPhoto;
use Illuminate\Support\Facades\Storage;

class JobCardController extends Controller
{


// public function print(JobCard $jobCard)
// {
//     $jobCard->load(['photos', 'branch']);
//    // dd($jobCard);
//     $logo = Branch::find($jobCard->branch_id)?->logo;
//     dd($logo);
//     return inertia('JobCards/Print', [
//         'job' => $jobCard,
//     ]);
// }

// public function print(JobCard $jobCard)
// {
//     $jobCard->load('branch');
//     dd($jobCard->branch?->logo);
//     return inertia('JobCards/Print', [
//         'job' => [
//             'id' => $jobCard->id,
//             'job_number' => $jobCard->job_number,
//             'technician' => $jobCard->technician,
//             'description' => $jobCard->description,
//             'status' => $jobCard->status,
//             'created_at' => $jobCard->created_at,
//             'branch_logo' => $jobCard->branch?->logo,
//             'branch_name' => $jobCard->branch?->name,
//             'customer_order_no' => $jobCard->customer_order_no,
//             'date' => $jobCard->date,
//             'to' => $jobCard->to,
//             'call_out_time' => $jobCard->call_out_time,
//             'start_time' => $jobCard->start_time,
//             'end_time' => $jobCard->end_time,
//             'email' => $jobCard->email,
//             'tel' => $jobCard->tel,
//             'signature' => $jobCard->signature,
//             'photos' => $jobCard->photos,
//         ],
//     ]);
// }

public function print(JobCard $jobCard)
{
    $jobCard->load(['photos', 'branch']);

    return inertia('JobCards/Print', [
        'job' => $jobCard,
    ]);
}

// public function all(Request $request)
// {
//     $jobcards = JobCard::with(['beforePhotos', 'afterPhotos'])
//         ->orderBy('created_at', 'desc')
//         ->get();

//     $technicians = User::where('user_role', 'technician')
//         ->select('id', 'name')
//         ->get();

//     $branches = Branch::select('id', 'name')->get();

//     return inertia('JobCards/AllJobCards', [
//         'jobcards' => $jobcards,
//         'technicians' => $technicians,
//         'branches' => $branches,
//     ]);
// }
public function all(Request $request)
{
    // $jobcards = JobCard::with(['beforePhotos', 'afterPhotos'])
    //     ->orderBy('created_at', 'desc')
    //     ->get();
    $jobcards = JobCard::with(['beforePhotos', 'afterPhotos'])
    ->orderBy('created_at', 'desc')
    ->get()
    ->map(function ($jobCard) {
        return [
            'id' => $jobCard->id,
            'job_number' => $jobCard->job_number,
            'technician' => $jobCard->technician,
            'branch_id' => $jobCard->branch_id,
            'description' => $jobCard->description,
            'status' => $jobCard->status,
            'created_at' => $jobCard->created_at,
            'signature' => $jobCard->signature,
            'date' => $jobCard->date,
            'customer_order_no' => $jobCard->customer_order_no,
            'call_out_time' => $jobCard->call_out_time,
            'start_time' => $jobCard->start_time,
            'end_time' => $jobCard->end_time,
            'to' => $jobCard->to,
            'email' => $jobCard->email,
            'tel' => $jobCard->tel,
            'beforePhotos' => $jobCard->beforePhotos->map(fn ($p) => [
                'id' => $p->id,
                'path' => $p->path,
            ])->values(),

            'afterPhotos' => $jobCard->afterPhotos->map(fn ($p) => [
                'id' => $p->id,
                'path' => $p->path,
            ])->values(),
        ];
    });
//dd($jobcards->first()->beforePhotos);
    $technicians = User::where('user_role', 'technician')
        ->select('id', 'name')
        ->get();

    $branches = Branch::select('id', 'name')->get();

    return inertia('JobCards/AllJobCards', [
        'jobcards' => $jobcards,
        'technicians' => $technicians,
        'branches' => $branches,
    ]);
}

public function complete(JobCard $job)
{
    $job->update(['status' => 'completed']);

    return back()->with('success', 'Job marked as complete!');
}


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
   // dd($jobCard);
    $jobCard->update($request->all());
   // dd($jobCard);
    return back()->with('success', 'Job updated successfully');
}

public function destroy(JobCard $jobCard)
{
    // Delete signature file if it exists
    if ($jobCard->signature && Storage::disk('public')->exists($jobCard->signature)) {
        Storage::disk('public')->delete($jobCard->signature);
    }

    // Delete before photos
    foreach ($jobCard->beforePhotos as $photo) {
        if (Storage::disk('public')->exists($photo->path)) {
            Storage::disk('public')->delete($photo->path);
        }
        $photo->delete();
    }

    // Delete after photos
    foreach ($jobCard->afterPhotos as $photo) {
        if (Storage::disk('public')->exists($photo->path)) {
            Storage::disk('public')->delete($photo->path);
        }
        $photo->delete();
    }

    // Delete the job card itself
    $jobCard->delete();

    return back()->with('success', 'Job Card deleted successfully.');
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


public function storeAfterPhotos(Request $request, JobCard $jobCard)
{
    $request->validate([
        'photos.*' => 'image|max:5120',
    ]);

    foreach ($request->file('photos', []) as $file) {
        $path = $file->store('jobcards/after', 'public');

        $jobCard->photos()->create([
            'path' => $path,
            'type' => 'after',
        ]);
    }

    return back()->with('success', 'After photos uploaded');
}


    public function myJobs()
    {
        $user = auth()->user();
        $jobs = \App\Models\JobCard::where('technician', $user->name)->get();
        $branches = Branch::select('id', 'name')->get();
        //dd($jobs);
        return Inertia::render('JobCards/MyJobs', [
            'jobcards' => $jobs,
            'branches' => $branches,
        ]);
    }

// clear signature
public function clearSignature(JobCard $job)
{
    
    if ($job->signature && Storage::exists('public/' . $job->signature)) {
        Storage::delete('public/' . $job->signature);
    }

    $job->signature = null;
    $job->save();

    return back()->with('success', 'Signature cleared.');
}


// public function show(JobCard $jobCard)
// {
   
//     $jobCard->load(['beforePhotos', 'afterPhotos']);

//     $technicians = User::where('user_role', 'technician')
//         ->select('id', 'name')
//         ->get();

//     return inertia('JobCards/Show', [
//         'job' => [
//             'id' => $jobCard->id,
//             'job_number' => $jobCard->job_number,
//             'technician' => $jobCard->technician,
//             'description' => $jobCard->description,
//             'status' => $jobCard->status,
//             'created_at' => $jobCard->created_at,
//             'signature' => $jobCard->signature,
//             'beforePhotos' => $jobCard->beforePhotos,
//             'afterPhotos' => $jobCard->afterPhotos,
//         ],
//         'technicians' => $technicians,
//     ]);
// }

public function show(JobCard $jobCard)
{
    $jobCard->load(['beforePhotos', 'afterPhotos']);

    $technicians = User::where('user_role', 'technician')
        ->select('id', 'name')
        ->get();

    return inertia('JobCards/Show', [
        'job' => [
            'id' => $jobCard->id,
            'job_number' => $jobCard->job_number,
            'technician' => $jobCard->technician,
            'description' => $jobCard->description,
            'status' => $jobCard->status,
            'created_at' => $jobCard->created_at,
            'signature' => $jobCard->signature,

            // existing relations
            'beforePhotos' => $jobCard->beforePhotos,
            'afterPhotos' => $jobCard->afterPhotos,

            // ✅ NEW FIELDS ADDED
            'branch_id' => $jobCard->branch_id,
            'branch' => $jobCard->branch, // optional but useful

            'call_out' => $jobCard->call_out,
            'labour_hours' => $jobCard->labour_hours,
            'travel_km' => $jobCard->travel_km,
            'remarks' => $jobCard->remarks,
            'client_name' => $jobCard->client_name,

            'customer_order_no' => $jobCard->customer_order_no,
            'date' => $jobCard->date,
            'to' => $jobCard->to,
            'call_out_time' => $jobCard->call_out_time,
            'start_time' => $jobCard->start_time,
            'end_time' => $jobCard->end_time,
            'email' => $jobCard->email,
            'tel' => $jobCard->tel,
        ],
        'technicians' => $technicians,
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

        $branches = Branch::select('id', 'name')->get();

        return Inertia::render('JobCards/Create', [
            'technicians' => $technicians,
            'branches' => $branches,
        ]);
    }

    // Store new job card


public function store(Request $request)
{
    //dd($request);
    $validated = $request->validate([
        'date' => 'required',
        'technician' => 'nullable|string',
        'branch_id' => 'required|exists:branches,id', 
        'customer_order_no' => 'nullable',
        'to' => 'nullable',
        'client_name' => 'nullable',
        'call_out_time' => 'nullable',
        'start_time' => 'nullable',
        'end_time' => 'nullable',
        'email' => 'nullable|email',
        'tel' => 'nullable',
        'description' => 'nullable',
        'status' => 'nullable|in:pending,in_progress,completed',
    ]);

    $validated['client_name'] = $validated['to'] ?? null;
    $jobCard = JobCard::create(array_merge($validated, [
        'job_number' => $this->generateJobNumber(),
    ]));
    return redirect()->route('jobcards.all');
    // return redirect()->route('jobcards.create');
}

private function generateJobNumber()
{
    $lastId = JobCard::max('id') + 1;
    return 'JC-' . str_pad($lastId, 6, '0', STR_PAD_LEFT);
}
}