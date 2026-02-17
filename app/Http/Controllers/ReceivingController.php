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
use App\Models\StockMovement;
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

    public function store(Request $request)
    {
        // -----------------------------
        // Validation
        // -----------------------------
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

        // -----------------------------
        // Load related models
        // -----------------------------
        $product    = Product::findOrFail($request->product_id);
        $supplier   = Supplier::findOrFail($request->supplier_id);
        $branch     = Branch::findOrFail($request->branch_id);
        $user       = Auth::user();
        $receivingType = ReceivingType::findOrFail($request->receiving_type_id);

        // -----------------------------
        // Save Receiving Record
        // -----------------------------
        $receiving = Receiving::create([
            'product_id'     => $product->id,
            'quantity'       => $request->quantity,
            'receiving_type' => $receivingType->name,
            'from_type'      => 'supplier',
            'from_id'        => $supplier->id,
            'to_type'        => 'branch',
            'to_id'          => $branch->id,
            'reference_id'   => null,
            'received_by'    => $user->id,
            'notes'          => $request->notes,
        ]);

        // -----------------------------
        // Create Stock Movement with Names
        // -----------------------------
        StockMovement::create([
            'type'             => 'receive',
            'sku'              => $product->sku,
            'quantity'         => $request->quantity,
            'from_location'    => "Supplier: {$supplier->name}",
            'to_location'      => "Branch: {$branch->name}",
            'movement_date'    => now(),
            'reference'        => 'Receiving ID: ' . $receiving->id,
            'performed_by'     => $user->name,
            'branch_id'        => $branch->id,
            'cost_per_unit'    => $product->cost ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'receiving' => $receiving,
        ]);
    }
}
