<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ReceivingType;
use App\Models\Branch;
use App\Models\User;
use App\Models\Product;
use App\Models\Receiving;
use App\Models\Supplier;
use Illuminate\Support\Facades\Auth;

class ReceivingController extends Controller
{
public function index(Request $request)
{
    return Inertia::render('Inventory/Stocks/Receiving', [
        'receiving_types' => ReceivingType::where('is_active', 1)
            ->orderBy('label')
            ->get(['id', 'name', 'label', 'description']),
        'branches' => Branch::orderBy('name')
            ->get(['id', 'name']),
        'users' => User::orderBy('name')
            ->get(['id', 'name']),
        'suppliers' => Supplier::where('is_active', 1)
            ->orderBy('name')
            ->get(['id', 'name']), // only get what you need
    ]);
}


    public function findProductByBarcode($barcode)
    {
        $product = Product::where('clean_barcode', $barcode)->first();

        if ($product) {
            return response()->json([
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'quantity' => $product->quantity,
            ]);
        }

        return response()->json(null, 404);
    }

public function store(Request $request)
{
    $request->validate([
        'supplier_id' => 'required|exists:suppliers,id',
        'invoice_number' => 'nullable|string|max:255', 
        'notes' => 'nullable|string',
        'received_at' => 'nullable|date', 
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1',
        'branch_id' => 'required|exists:branches,id',
        'receiving_type_id' => 'required|exists:receiving_types,id',
    ]);

    
    $receivingType = ReceivingType::find($request->receiving_type_id);

    $receiving = Receiving::create([
        'product_id'     => $request->product_id,
        'quantity'       => $request->quantity,
        'receiving_type' => $receivingType->name,
        'from_type'      => 'supplier',
        'from_id'        => $request->supplier_id,
        'to_type'        => 'branch',
        'to_id'          => $request->branch_id,
        'reference_id'   => null,
        'received_by'    => Auth::id(),
        'notes'          => $request->notes,
    ]);

    return response()->json([
        'success' => true,
        'receiving' => $receiving,
    ]);
}

}
