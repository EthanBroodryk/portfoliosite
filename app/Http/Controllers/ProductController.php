<?php

namespace App\Http\Controllers;

use App\Models\Product;       
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('id', 'desc')->get();

        return inertia('Inventory/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        return inertia('Inventory/Products/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => 'required|unique:products',
            'name' => 'required',
            'cost_price' => 'numeric',
            'sell_price' => 'numeric',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'Product created!');
    }
}
