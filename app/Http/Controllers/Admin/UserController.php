<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    // List all users
    public function index()
    {
        return Inertia::render('Admin/manageUsers', [
            'users' => User::with('branch:id,name')
                ->select('id', 'name', 'email', 'branch_id', 'user_role') // <-- add user_role
                ->get(),
            'branches' => Branch::select('id', 'name')->get(),
        ]);
    }


    // Show create form
    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'branches' => Branch::select('id', 'name')->get(),
        ]);
    }

    // Store new user
    public function store(Request $request)
    {
        //dd($request);
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'password'  => 'required|string|min:6',
            'branch_id' => 'nullable|exists:branches,id',
            'user_role' => 'required|string|in:super_user,admin,technician',
        ]);

        User::create([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($validated['password']),
            'branch_id' => $validated['branch_id'] ?? null,
            'user_role' => $validated['user_role'],
        ]);

        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    // Show edit form
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user'     => $user,
            'branches' => Branch::select('id', 'name')->get(),
        ]);
    }

    // Update existing user
public function update(Request $request, User $user)
{
    
    $validated = $request->validate([
        'name'      => 'required|string|max:255',
        'email'     => "required|email|unique:users,email,{$user->id}",
        'password'  => 'nullable|string|min:6',
        'branch_id' => 'nullable|exists:branches,id',
        'user_role' => 'required|string|in:super_user,admin,technician',
    ]);

    $user->update([
        'name'      => $validated['name'],
        'email'     => $validated['email'],
        'branch_id' => $validated['branch_id'] ?? null,
        'user_role' => $validated['user_role'], // <--- Add this
    ]);

    if (!empty($validated['password'])) {
        $user->update(['password' => Hash::make($validated['password'])]);
    }

    return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
}


    // Delete user
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
    }
}
