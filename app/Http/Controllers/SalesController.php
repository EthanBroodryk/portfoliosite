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
  public function index()
    {
        $sales = Sale::with('user')->orderBy('id','desc')->get();
        return Inertia::render('Pos/Sales', [
            'sales' => $sales,
        ]);
    }


}
