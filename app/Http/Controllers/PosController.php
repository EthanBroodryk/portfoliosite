<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class PosController extends Controller
{
    // Show POS create page
    public function create()
    {
        $products = Product::all()->map(function ($p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'sell_price' => (float) $p->sell_price,
                'clean_barcode' => (string) $p->clean_barcode,
            ];
        });

        return inertia('Pos/Create', [
            'products' => $products,
        ]);
    }

    // Store a sale (example)
    public function store(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $total = collect($data['items'])->sum(function ($item) {
            $product = Product::find($item['product_id']);
            return $product->sell_price * $item['quantity'];
        });

        // Save sale logic here (example)
        // Sale::create([...]);

        // Clear cached cart after sale
        Cache::forget('pos_cart_' . auth()->id());

        return redirect()->route('pos.create')->with('success', 'Sale created successfully');
    }

    // ----- Scan barcode and add to cart -----
    public function scanBarcode(Request $request)
    {
        $barcode = trim($request->barcode);

        $product = Product::where('clean_barcode', $barcode)->first();

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

     

        $cart = Cache::get('pos_cart_' . auth()->id(), []);

        // Check if product already in cart
        $index = collect($cart)->search(fn ($item) => $item['product_id'] === $product->id);

        if ($index !== false) {
            $cart[$index]['quantity']++;
        } else {

            $cart[] = [
                'product_id'   => $product->id,
                'name'         => $product->name,
                'sell_price'   => $product->sell_price,
                'quantity'     => 1,
                'clean_barcode' => $product->clean_barcode,
            ];

        }

        // Save updated cart to cache for 30 mins
        Cache::put('pos_cart_' . auth()->id(), $cart, now()->addMinutes(30));

        return response()->json([
            'cart' => $cart,
        ]);
    }

    // ----- Remove barcode from cart -----
    public function removeFromCart(Request $request)
    {

        
        $barcode = trim($request->barcode);
     

        $cart = Cache::get('pos_cart_' . auth()->id(), []);

        

        $product = Product::where('clean_barcode', $barcode)->first();

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $cart = array_filter($cart, fn ($item) => $item['product_id'] !== $product->id);
        $cart = array_values($cart); // reindex array

        Cache::put('pos_cart_' . auth()->id(), $cart, now()->addMinutes(30));

        return response()->json([
            'cart' => $cart,
        ]);
    }


    // ----- increase individual qty --------

    public function increaseQty(Request $request)
{
    $barcode = trim($request->barcode);

    $cart = Cache::get('pos_cart_' . auth()->id(), []);

    foreach ($cart as &$item) {
        if ($item['clean_barcode'] === $barcode) {
            $item['quantity'] += 1;
            break;
        }
    }

    Cache::put('pos_cart_' . auth()->id(), $cart, now()->addMinutes(30));

    return response()->json([
        'cart' => $cart,
    ]);
}


    //----- deacrease idividual quantity

    public function decreaseQty(Request $request)
{
    $barcode = trim($request->barcode);

    $cart = Cache::get('pos_cart_' . auth()->id(), []);

    foreach ($cart as $index => &$item) {
        if ($item['clean_barcode'] === $barcode) {

            // Reduce qty
            $item['quantity'] -= 1;

            // If qty hits 0, remove from cart
            if ($item['quantity'] <= 0) {
                unset($cart[$index]);
            }

            break;
        }
    }

    // Reindex array
    $cart = array_values($cart);

    Cache::put('pos_cart_' . auth()->id(), $cart, now()->addMinutes(30));

    return response()->json([
        'cart' => $cart,
    ]);
}


    // ----- Get current cart (polling) -----
    public function getCart()
    {
        $cart = Cache::get('pos_cart_' . auth()->id(), []);

        return response()->json([
            'cart' => $cart,
        ]);
    }
}
