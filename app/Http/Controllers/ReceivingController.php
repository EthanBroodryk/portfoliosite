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
        $request->validate([
            'supplier_id'       => 'required|exists:suppliers,id',
            'invoice_number'    => 'nullable|string|max:255',
            'notes'             => 'nullable|string',
            'received_at'       => 'nullable|date',
            'product_id'        => 'required|exists:products,id',
            'quantity'          => 'required|integer|min:1',
            'receiving_type_id' => 'required|exists:receiving_types,id',
        ]);

        $product       = Product::findOrFail($request->product_id);
        $supplier      = $request->supplier_id ? Supplier::findOrFail($request->supplier_id) : null;
        $branch        = $request->branch_id ? Branch::findOrFail($request->branch_id) : null;
        $user          = Auth::user();
        $receivingType = ReceivingType::findOrFail($request->receiving_type_id);

        $from_type     = null;
        $to_type       = null;
        $from_id       = null;
        $to_id         = null;
        $from_location = "";
        $to_location   = "";
        $type          = "";

        switch ($receivingType->name) {

            case "RETURN_BRANCH":
                // Correct logic: branch → branch
                $from_type = 'branch';
                $to_type   = 'branch';

                $from_id = $request->fromBranch; 
                $to_id   = $request->toBranch;

                $from_location = "Branch ID: {$request->fromBranch}";
                $to_location   = "Branch ID: {$request->toBranch}";

                $type = "Branch Transfer";
                break;

            case "SUPPLIER":
                // Supplier → branch
                $from_type = 'supplier';
                $to_type   = 'branch';

                $from_id = $request->supplier_id;
                $to_id   = $request->branch_id;

                $from_location = "Supplier: {$supplier->name}";
                $to_location   = "Branch: {$branch->name}";

                $type = "Supplier to Warehouse";
                break;
        }

        // Save Receiving Record
        $receiving = Receiving::create([
            'product_id'     => $product->id,
            'quantity'       => $request->quantity,
            'receiving_type' => $receivingType->name,
            'from_type'      => $from_type,
            'from_id'        => $from_id,
            'to_type'        => $to_type,
            'to_id'          => $to_id,
            'reference_id'   => null,
            'received_by'    => $user->id,
            'notes'          => $request->notes,
        ]);

        // Create Stock Movement
        StockMovement::create([
            'type'             => $type,
            'sku'              => $product->sku,
            'quantity'         => $request->quantity,
            'from_location'    => $from_location,
            'to_location'      => $to_location,
            'movement_date'    => now(),
            'reference'        => 'Receiving ID: ' . $receiving->id,
            'performed_by'     => $user->name,
            'branch_id'        => $branch->id ?? null,
            'cost_per_unit'    => $product->cost ?? 0,
        ]);

        return response()->json([
            'success' => true,
            'receiving' => $receiving,
        ]);
    }
}
