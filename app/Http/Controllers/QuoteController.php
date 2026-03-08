<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return Inertia::render('CustomerManagement/generateQuote');
    }

    public function searchCustomer(Request $request)
    {
        $query = $request->input('query', '');

        $customers = Customer::where('name', 'LIKE', "%{$query}%")
            ->orWhere('phone', 'LIKE', "%{$query}%")
            ->limit(10) 
            ->get(['id', 'name', 'phone']);

        return response()->json($customers);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
        {
            $quote = Quote::create([
                'customer_id' => $request->customer_id,
                'quote_number' => 'Q-' . time(),
                'total' => $request->total,
                'status' => 'draft',
                'valid_until' => $request->valid_until,
                'quote_details' => $request->quote_details
            ]);

        return $quote;
    }

    /**
     * Display the specified resource.
     */
    public function show(Quote $quote)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Quote $quote)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Quote $quote)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Quote $quote)
    {
        //
    }
}
