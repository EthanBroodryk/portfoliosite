<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Branch;
use Inertia\Inertia;

class BranchesController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/manageBranches', [
            'branches' => Branch::select('id', 'name', 'location')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'location' => 'required|string|max:255',
        ]);

        Branch::create($validated);

        return back()->with('success', 'Branch added successfully.');
    }

    
    public function update(Request $request, Branch $branch)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'location' => 'required|string|max:255',
        ]);

        $branch->update($validated);

        return back()->with('success', 'Branch updated successfully.');
    }
}
