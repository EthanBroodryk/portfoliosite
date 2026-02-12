<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stock;
use App\Models\Product;
use App\Models\Branch;
use App\Models\User;
use App\Models\StockMovement;
use Inertia\Inertia;

class StockController extends Controller
{
    // List all stock
    // public function index(Request $request)
    // {
        
    //     $stocks = Stock::with(['product', 'branch'])->paginate(50);

    //     return Inertia::render('Inventory/Stocks/Index', [
    //         'stocks' => $stocks,
    //     ]);
    // }

    // public function index(Request $request)
    // {
        
    //     //$stocks = Stock::with(['product', 'branch'])->paginate(50);
    //     // $stock_movements = StockMovement::all();
    //     $stock_movements = StockMovement::with('branch')->paginate(50);
    //   //  dd($stock_movements->items());


    //     return Inertia::render('Inventory/Stocks/Index', [
    //         'stock_movements' => $stock_movements,
    //     ]);
    // }

public function index(Request $request)
{
    //dd($request);
    $query = StockMovement::with(['branch', 'performedByUser']);

    // Filter by Type
    if ($request->type) {
        $query->where('type', $request->type);
    }

    // Filter by Branch
    if ($request->branch_id) {
        $query->where('branch_id', $request->branch_id);
    }

    // Filter by User ID
    // if ($request->user_id) {
    //     $query->where('performed_by', $request->user_id);
    // }
    if ($request->user_id) {
        $userName = User::where('id', $request->user_id)->value('name');
        $query->where('performed_by', $userName);
    }


    // Filter by Date Range
    if ($request->date_from) {
        $query->whereDate('movement_date', '>=', $request->date_from);
    }
    if ($request->date_to) {
        $query->whereDate('movement_date', '<=', $request->date_to);
    }

    $stock_movements = $query->paginate(50)->withQueryString();

    return Inertia::render('Inventory/Stocks/Index', [
        'stock_movements' => $stock_movements,
        'filters' => $request->only(['type', 'branch_id', 'user_id', 'date_from', 'date_to']),
        'branches' => \App\Models\Branch::select('id', 'name')->get(),
        'users' => \App\Models\User::select('id', 'name')->get(),
    ]);
}



    //check if product exists

    

    
    // Show form to create stock
    public function create(Request $request)
    {
        return Inertia::render('Inventory/Stocks/Create', [
            'branches' => Branch::select('id', 'name')->get(),
        ]);
    }


    // Store stock
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'branch_id'  => 'required|exists:branches,id',
            'quantity'   => 'required|integer|min:0',
        ]);

        Stock::create([
            'product_id' => $request->product_id,
            'branch_id'  => $request->branch_id,
            'quantity'   => $request->quantity,
        ]);

        return redirect()->back()->with('success', 'Stock added successfully!');
    }

    // Show stock for a single product
    public function productStock($productId)
    {
        $product = Product::findOrFail($productId);

        $stocks = Stock::where('product_id', $productId)
            ->with('branch')
            ->get();

        return Inertia::render('Stock/Product', [
            'product' => $product,
            'stocks'  => $stocks,
        ]);
    }

    // Update stock quantity
    public function update(Request $request, Stock $stock)
    {
        $request->validate([
            'quantity' => 'required|integer'
        ]);

        $stock->update([
            'quantity' => $request->quantity
        ]);

        return redirect()->back()->with('success', 'Stock updated!');
    }

    // Transfer stock between branches
    public function transfer(Request $request)
    {
        $request->validate([
            'product_id'      => 'required|exists:products,id',
            'from_branch_id'  => 'required|exists:branches,id',
            'to_branch_id'    => 'required|exists:branches,id',
            'quantity'        => 'required|integer|min:1'
        ]);

        // subtract stock from source
        $from = Stock::where('product_id', $request->product_id)
            ->where('branch_id', $request->from_branch_id)
            ->firstOrFail();

        if ($from->quantity < $request->quantity) {
            return back()->with('error', 'Not enough stock in source branch.');
        }

        $from->decrement('quantity', $request->quantity);

        // add stock to destination
        $to = Stock::firstOrNew([
            'product_id' => $request->product_id,
            'branch_id'  => $request->to_branch_id
        ]);

        $to->quantity += $request->quantity;
        $to->save();

        return redirect()->back()->with('success', 'Stock transferred!');
    }
}
