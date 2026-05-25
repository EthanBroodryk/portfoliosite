<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Invoice;

class InvoiceGeneratorController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('invoiceGenerator', [
            'invoices' => Invoice::latest()->get(),
        ]);
    }

    public function store(Request $request)
{
    // 1. Validate the incoming data against your new database columns
    $validated = $request->validate([
        'client_name'    => 'required|string|max:255',
        'email'          => 'required|email|max:255',
        'invoice_number' => 'required|string|unique:invoices,invoice_number',
        'amount'         => 'required|numeric|min:0',
        'description'    => 'nullable|string',
        'bank_name'      => 'required|string|max:255',
        'account_type'   => 'required|string|in:checking,savings',
        'branch_code'    => 'required|string|max:50',
        'account_number' => 'required|string|max:50',
        'logo'           => 'nullable|image|max:2048', // Max 2MB file
    ]);

    // 2. Handle file system storage if a custom logo is uploaded
    $logoPath = null;
    if ($request->hasFile('logo')) {
        $logoPath = $request->file('logo')->store('invoicelogos', 'public');
    }

    // 3. Save the document into the database using mass assignment
    Invoice::create([
        'client_name'    => $validated['client_name'],
        'email'          => $validated['email'],
        'invoice_number' => $validated['invoice_number'],
        'amount'         => $validated['amount'],
        'description'    => $validated['description'],
        'bank_name'      => $validated['bank_name'],
        'account_type'   => $validated['account_type'],
        'branch_code'    => $validated['branch_code'],
        'account_number' => $validated['account_number'],
        'logo'           => $logoPath, // Stores only the disk path relative string
    ]);

    // 4. Smooth Inertia redirect back to keep state active
    return redirect()->back()->with('success', 'Invoice created successfully!');
}


}