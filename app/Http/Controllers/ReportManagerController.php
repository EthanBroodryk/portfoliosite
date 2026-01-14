<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportManagerController extends Controller
{
    //
    

    public function index(Request $request)
    {
        //dd($request);
        return Inertia::render('manageReports');
    }
}
