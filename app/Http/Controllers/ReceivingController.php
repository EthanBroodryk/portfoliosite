<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ReceivingType;
use App\Models\Branch;
use App\Models\User;
use App\Models\Product;
use App\Models\Receiving;
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

    // New method to store receiving
    public function store(Request $request)
    {
        
        $request->validate([
            'supplier_name' => 'required|string|max:255',
            'invoice_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'received_at' => 'required|date',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'branch_id' => 'required|exists:branches,id',
            'receiving_type_id' => 'required|exists:receiving_types,id',
        ]);

        $receiving = Receiving::create([
            'supplier_name' => $request->supplier_name,
            'invoice_number' => $request->invoice_number,
            'notes' => $request->notes,
            'received_at' => $request->received_at,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'branch_id' => $request->branch_id,
            'user_id' => Auth::id() ?? $request->user_id,
            'receiving_type_id' => $request->receiving_type_id,
        ]);

        // Optional: Update stock movements or product quantity
        $product = Product::find($request->product_id);
        $product->quantity += $request->quantity;
        $product->save();

        return response()->json([
            'success' => true,
            'receiving' => $receiving,
            'new_product_quantity' => $product->quantity,
        ]);
    }
}
