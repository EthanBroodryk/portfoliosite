<?php

namespace App\Http\Controllers;


use Inertia\Inertia;
use App\Models\JobCard;
use App\Models\User;
use App\Models\Branch;
use App\Models\JobCardPhoto;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Checkin;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Carbon\Carbon;


class JobCardController extends Controller
{

public function gpsTest(Request $request)
{
    $jobCardId = JobCard::query()->value('id'); // get ANY valid job card

    DB::table('checkins')->insert([
        'user_id' => auth()->id(),
        'job_card_id' => $jobCardId, // safe dynamic value
        'latitude' => $request->latitude,
        'longitude' => $request->longitude,
        'accuracy' => $request->accuracy,
        'checked_in_at' => now(),
        'type' => 'gps_test',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return response()->json([
        'success' => true,
        'job_card_id_used' => $jobCardId,
        'received' => $request->all(),
    ]);
}


public function checkin(Request $request, JobCard $jobCard)
{
    $validated = $request->validate([
        'latitude' => 'nullable|numeric',
        'longitude' => 'nullable|numeric',
        'accuracy' => 'nullable|numeric',
        'timestamp' => 'required|date',
    ]);

    //dd($validated);

    $checkin = Checkin::create([
        'user_id' => Auth::id(),
        'job_card_id' => $jobCard->id,
        'latitude' => $validated['latitude'],
        'longitude' => $validated['longitude'],
        'accuracy' => $validated['accuracy'] ?? null,
        'checked_in_at' => \Carbon\Carbon::parse($validated['timestamp']),
        'type' => 'start',
    ]);

    // optional: update job status when started
    $jobCard->update([
        'status' => 'in progress',
        'start_time' => now(),
    ]);

        return back()->with([
        'success' => 'Check-in saved successfully',
    ]);
}


public function print(JobCard $jobCard)
{
    $jobCard->load(['photos', 'branch']);

    return inertia('JobCards/Print', [
        'job' => $jobCard,
    ]);
}


//show job cards to admin
public function all(Request $request)
{
    
    
    $jobcards = JobCard::with(['beforePhotos', 'afterPhotos','checkins'])
    ->orderBy('created_at', 'desc')
    ->get()
    ->map(function ($jobCard) {
        return [
            'id' => $jobCard->id,
            'job_number' => $jobCard->job_number,
            'technician' => $jobCard->technician,
            'branch_id' => $jobCard->branch_id,
            'description' => $jobCard->description,
            'remarks' => $jobCard->remarks,
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
            'engine_serial_nr' => $jobCard->engine_serial_nr,
            'engine_model_nr' => $jobCard->engine_model_nr,
            'run_hours' => $jobCard->run_hours,
            'beforePhotos' => $jobCard->beforePhotos->map(fn ($p) => [
                'id' => $p->id,
                'path' => $p->path,
            ])->values(),

            'afterPhotos' => $jobCard->afterPhotos->map(fn ($p) => [
                'id' => $p->id,
                'path' => $p->path,
            ])->values(),
            'checkins' => $jobCard->checkins->map(fn ($c) => [
                'id' => $c->id,
                'user_id' => $c->user_id,
                'type' => $c->type,
                'latitude' => $c->latitude,
                'longitude' => $c->longitude,
                'accuracy' => $c->accuracy,
                'checked_in_at' => $c->checked_in_at,
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
    $jobCard->signature = $path;
    $jobCard->save();

    return back();
}

// public function update(Request $request, JobCard $jobCard)
// {
//    dd($jobCard);
//     $jobCard->update($request->all());
//    // dd($jobCard);
//     return back()->with('success', 'Job updated successfully');
// }

public function update(Request $request, JobCard $jobCard)
{
   // dd($request);
    // If user is changing status TO "return job", delete checkins first
    if ($request->status === 'return job') {
        $jobCard->checkins()->delete();
    }
    // Now update the job card
     $jobCard->update($request->all());
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


//loads all jobs for technicinas
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



//THIS SHOWS INDIVIDUAL JOB CARD BELONGING TO TECHNICIAN
public function show(JobCard $jobCard)
{


    $jobCard->load(['beforePhotos', 'afterPhotos','checkins']);
   // dd($jobCard);
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
            'beforePhotos' => $jobCard->beforePhotos,
            'afterPhotos' => $jobCard->afterPhotos,
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
            'checkins' => $jobCard->checkins,
            'engine_serial_nr' => $jobCard->engine_serial_nr,
            'engine_model_nr' => $jobCard->engine_model_nr,
            'run_hours' => $jobCard->run_hours,
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

        $super_users = User::where('user_role', 'super_user')->select('id','name')->get();
        $branches = Branch::select('id', 'name')->get();

        return Inertia::render('JobCards/Create', [
            'technicians' => $technicians,
            'super_users' => $super_users,
            'branches' => $branches,
        ]);
    }

    // Store new job card


public function store(Request $request)
{
    
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
    return DB::transaction(function () {
        // lock row so no two users generate same number
        $seq = DB::table('job_sequences')->lockForUpdate()->first();

        // Get next number
        $next = $seq->last_number + 1;

        // Update sequence table
        DB::table('job_sequences')->update([
            'last_number' => $next
        ]);

        // Return formatted job number
        return 'JC-' . str_pad($next, 6, '0', STR_PAD_LEFT);
    });
}


}