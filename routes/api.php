<?php 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;

Route::post('/contact', function (Request $request) {

    dd($request);
    // Honeypot check
    if ($request->filled('website')) {
        // Bot submission detected
        return response()->json(['success' => false, 'message' => 'Spam detected.'], 400);
    }

    // Validate input
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'message' => 'required|string',
    ]);

    // Send email
    Mail::to('contact@zenchitechnologies.com')->send(new ContactFormMail($validated));

    return response()->json(['success' => true]);
});
