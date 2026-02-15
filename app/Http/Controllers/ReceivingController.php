<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ReceivingType;
use App\Models\Branch;
use App\Models\User;

class ReceivingController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Inventory/Stocks/Receiving', [
            'receiving_types' => ReceivingType::where('is_active', 1)
                ->orderBy('label')
                ->get(['id', 'name', 'label', 'description']),
            'branches' => Branch::orderBy('name')
                ->get(['id', 'name']),
            'users' => User::orderBy('name')
                ->get(['id', 'name']),
        ]);
    }
}
