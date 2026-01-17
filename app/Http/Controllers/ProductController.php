<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Picqer\Barcode\BarcodeGeneratorPNG;

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
            'sku' => 'required|unique:products,sku',
            'name' => 'required',
            'cost_price' => 'required|numeric',
            'sell_price' => 'required|numeric',
        ]);

        // Create product
        $product = Product::create($validated);

        // Barcode value = SKU
        $barcodeValue = $product->sku;

        // Generate barcode PNG
        $generator = new BarcodeGeneratorPNG();
        $barcodePng = $generator->getBarcode($barcodeValue, $generator::TYPE_CODE_128);

        // Save file
        $barcodePath = 'barcodes/' . $barcodeValue . '.png';
        file_put_contents(storage_path('app/public/' . $barcodePath), $barcodePng);

        // Save file path
        $product->barcode = $barcodePath;
        $product->save();

        return redirect()->back()->with('success', 'Product created');
    }
}
