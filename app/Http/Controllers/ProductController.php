<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Picqer\Barcode\BarcodeGeneratorPNG;

class ProductController extends Controller
{
    // public function index()
    // {
    //     $products = Product::orderBy('id', 'desc')->get();
        

    //     return inertia('Inventory/Products/Index', [
    //         'products' => $products,
    //     ]);
    // }
public function index(Request $request)
{
    $pageSize = $request->pageSize ?? 50;
    $products = Product::orderBy('id', 'desc')->paginate($pageSize);

    return inertia('Inventory/Products/Index', [
        'products' => $products,
    ]);
}


//find product barcode

public function findByBarcode($barcode)
{

    
    $product = Product::where('clean_barcode', $barcode)->first();

    if (!$product) {
        return response()->json([
            'found' => false,
        ], 404);
    }

    return response()->json([
        'found' => true,
        'product' => $product,
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

    // Save both barcode path and clean barcode
    $product->barcode = $barcodePath;       // PNG path
    $product->clean_barcode = $barcodeValue; // SKU for easy lookup in POS
    $product->save();

    return redirect()->back()->with('success', 'Product created');
}








    public function edit(Product $product)
    {
        return inertia('Inventory/Products/Edit', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'sku' => 'required|unique:products,sku,' . $product->id,
            'name' => 'required',
            'cost_price' => 'required|numeric',
            'sell_price' => 'required|numeric',
        ]);

        $product->update($validated);

        
        if ($product->wasChanged('sku')) {
            $barcodeValue = $product->sku;
            $generator = new \Picqer\Barcode\BarcodeGeneratorPNG();
            $barcodePng = $generator->getBarcode($barcodeValue, $generator::TYPE_CODE_128);
            $barcodePath = 'barcodes/' . $barcodeValue . '.png';
            file_put_contents(storage_path('app/public/' . $barcodePath), $barcodePng);
            $product->barcode = $barcodePath;
            $product->save();
        }

        return redirect()->route('products.index')->with('success', 'Product updated');
    }
        public function destroy(Product $product)
        {
            $product->delete();

            return response()->json([
                'message' => 'Product deleted successfully',
            ]);
        }


}
