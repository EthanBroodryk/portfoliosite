<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ReportData;
use App\Models\Sale;
use App\Models\User;

class SalesController extends Controller
{
    //
//   public function index()
//     {
//         $sales = Sale::with('user')->orderBy('id','desc')->get();
//         return Inertia::render('Pos/Sales', [
//             'sales' => $sales,
//         ]);
//     }
    // public function index(Request $request)
    // {
    //     $sales = Sale::with('user')
    //         ->orderBy('id', 'desc')
    //         ->paginate(50); // load only 50 per page

    //     return Inertia::render('Pos/Sales', [
    //         'sales' => $sales,
    //     ]);
    // }


public function index(Request $request)
{
    $query = Sale::with('user');

    if ($request->invoice) {
        $query->where('invoice_number', 'LIKE', "%{$request->invoice}%");
    }

    if ($request->status) {
        $query->where('status', 'LIKE', "%{$request->status}%");
    }

    if ($request->method) {
        $query->where('payment_method', 'LIKE', "%{$request->method}%");
    }

    if ($request->user) {
        $query->whereHas('user', function ($q) use ($request) {
            $q->where('name', 'LIKE', "%{$request->user}%");
        });
    }

    if ($request->date) {
        $query->whereDate('created_at', $request->date);
    }

    $sales = $query->orderBy('id', 'desc')->paginate(
        $request->pageSize ?? 20
    )->withQueryString();

    return Inertia::render('Pos/Sales', [
        'sales' => $sales,
    ]);
}



    public function items(Sale $sale)
    {
        $sale->load(['items.product', 'user']);

        return response()->json([
            'sale' => $sale,
            'items' => $sale->items,
        ]);
    }





}
