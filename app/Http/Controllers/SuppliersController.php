<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Supplier;

class SuppliersController extends Controller
{
    //
    public function index(Request $request)
    {

        return Inertia::render('Inventory/Suppliers/suppliers');

    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'nullable|email',
        'phone' => 'nullable|string|max:50',
    ]);

    Supplier::create([
        ...$validated,
        'contact_name' => $request->contact_name,
        'website' => $request->website,
        'address_line1' => $request->address_line1,
        'address_line2' => $request->address_line2,
        'city' => $request->city,
        'province' => $request->province,
        'postal_code' => $request->postal_code,
        'country' => $request->country,
        'vat_number' => $request->vat_number,
        'account_number' => $request->account_number,
        'payment_terms' => $request->payment_terms,
        'is_active' => $request->is_active ?? true,
        'created_by' => auth()->id(),
    ]);

    return redirect()->back()->with('success', 'Supplier added.');
}

}
