<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormMail;

class ContactFormController extends Controller
{
    public function send(Request $request)
    {
        // Validate the form inputs
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        // Send email
        Mail::to('contact@zenchitechnologies.com')->send(new ContactFormMail($data));

        // Redirect back with Inertia flash message
        return back()->with('success', 'Message sent successfully!');
    }
}
