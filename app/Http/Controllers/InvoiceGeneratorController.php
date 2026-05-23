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
        $validated = $request->validate([
            'client_name' => 'required|string',
            'email' => 'required|email',
            'invoice_number' => 'required|string|unique:invoices,invoice_number',
            'amount' => 'required|numeric',
            'status' => 'required|string',
            'logo' => 'nullable|image|max:2048',
        ]);

        // store file
        $logoPath = null;

        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('invoicelogos', 'public');
        }

        // save invoice
        Invoice::create([
            'client_name' => $validated['client_name'],
            'email' => $validated['email'],
            'invoice_number' => $validated['invoice_number'],
            'amount' => $validated['amount'],
            'status' => $validated['status'],
            'logo' => $logoPath, // ONLY path
        ]);

        return redirect()->back()->with('success', 'Invoice created successfully!');
    }
}