<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;

class PosController extends Controller
{
    // Show POS create page
    public function create()
    {
        // Get all products and cast fields properly
        $products = Product::all()->map(function ($p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'sell_price' => (float)$p->sell_price,
                'clean_barcode' => (string)$p->clean_barcode,
            ];
        });

        return Inertia::render('Pos/Create', [
            'products' => $products,
        ]);
    }

    // Store sale (example)
    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Example: calculate total
        $total = collect($data['items'])->sum(function ($item) {
            $product = Product::find($item['product_id']);
            return $product->sell_price * $item['quantity'];
        });

        // Save sale logic here...
        // Sale::create([...]);

        return redirect()->route('pos.create')->with('success', 'Sale created successfully');
    }
}
