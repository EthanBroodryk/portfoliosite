<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;

class PosController extends Controller
{
    //
    public function create()
{
    $products = Product::all(); // or paginate if needed
    return Inertia::render('Pos/Create', [
        'products' => $products,
    ]);
}

public function store(Request $request)
{
    $data = $request->validate([
        'items' => 'required|array',
        'items.*.product_id' => 'required|exists:products,id',
        'items.*.quantity' => 'required|integer|min:1',
    ]);

    // Save sale logic
    $sale = Sale::create([
        'user_id' => auth()->id(),
        'total' => collect($data['items'])->sum(function ($item) {
            $product = Product::find($item['product_id']);
            return $product->sell_price * $item['quantity'];
        }),
    ]);

    foreach ($data['items'] as $item) {
        SaleItem::create([
            'sale_id' => $sale->id,
            'product_id' => $item['product_id'],
            'quantity' => $item['quantity'],
            'price' => Product::find($item['product_id'])->sell_price,
        ]);
    }

    return redirect()->route('pos.create')->with('success', 'Sale created successfully');
}

}
