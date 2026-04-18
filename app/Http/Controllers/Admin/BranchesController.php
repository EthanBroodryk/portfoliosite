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
            'branches' => Branch::select('id', 'name', 'location', 'logo')->get(),
            
        ]);
    }

  public function store(Request $request)
{
    $validated = $request->validate([
        'name'     => 'required|string|max:255',
        'location' => 'required|string|max:255',
        'logo'     => 'nullable|image|max:2048',
    ]);

    if ($request->hasFile('logo')) {
        $validated['logo'] = $request->file('logo')->store('branch-logos', 'public');
    }

    Branch::create($validated);

    return back()->with('success', 'Branch added successfully.');
}

    
    public function update(Request $request, Branch $branch)
        {

        
            $validated = $request->validate([
                'name'     => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'logo'     => 'nullable|image|max:2048',
            ]);

            if ($request->hasFile('logo')) {
                
                // delete old logo if exists
                if ($branch->logo) {
                    \Storage::disk('public')->delete($branch->logo);
                }

                $validated['logo'] = $request->file('logo')->store('branch-logos', 'public');
            }

            $branch->update($validated);

            return back()->with('success', 'Branch updated successfully.');
        }
}
