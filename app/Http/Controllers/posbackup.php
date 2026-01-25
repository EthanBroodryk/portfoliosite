<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class PosController extends Controller
{
    /**
     * Show POS page
     */
    public function create()
    {
        // IMPORTANT: Use clean_barcode instead of barcode path
        $products = Product::select('id', 'name', 'sell_price', 'clean_barcode')->get();
        dd($products);
        return Inertia::render('Pos/Create', [
            'products' => $products,
        ]);
    }

    /**
     * Receives a scanned barcode and broadcasts it for polling
     */
    public function scanBroadcast(Request $request)
    {
        $request->validate([
            'barcode' => 'required|string',
        ]);

        // Save as latest scanned barcode
        Cache::put('latest_barcode', $request->barcode, now()->addSeconds(5));

        return response()->json(['success' => true]);
    }

    /**
     * Endpoint for polling the latest scanned barcode
     */
    public function latestBarcode()
    {
        $barcode = Cache::pull('latest_barcode', null); // pull = get + delete

        return response()->json([
            'barcode' => $barcode
        ]);
    }

    /**
     * Broadcast a remove event
     */
    public function removeBroadcast(Request $request)
    {
        $request->validate([
            'barcode' => 'required|string',
        ]);

        Cache::put('latest_remove', $request->barcode, now()->addSeconds(5));

        return response()->json(['success' => true]);
    }

    /**
     * Poll latest remove event
     */
    public function latestRemove()
    {
        $barcode = Cache::pull('latest_remove', null);

        return response()->json([
            'barcode' => $barcode
        ]);
    }

    /**
     * Save a Sale
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $sale = Sale::create([
            'user_id' => auth()->id(),
            'total' => collect($data['items'])->sum(function ($item) {
                $product = Product::find($item['product_id']);
                return $product->sell_price * $item['quantity'];
            }),
        ]);

        foreach ($data['items'] as $item) {
            $product = Product::find($item['product_id']);

            SaleItem::create([
                'sale_id' => $sale->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $product->sell_price,
            ]);
        }

        return redirect()->route('pos.create')->with('success', 'Sale created successfully');
    }
}
