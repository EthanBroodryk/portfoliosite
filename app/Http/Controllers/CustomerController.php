<?php
namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    // LIST ALL
    public function index()
    {
        return Customer::orderBy('name')->get();
    }


    public function addCustomer(Request $request)
    {

       return Inertia::render('CustomerManagement/addCustomer');

    }


    //SEARCH
    public function search(Request $request)
    {
        $query = $request->get('query');
        $customers = Customer::where('name', 'like', "%{$query}%")
            ->orWhere('phone', 'like', "%{$query}%")
            ->limit(10)
            ->get();
        return response()->json($customers);
    }

    // CREATE
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'type' => 'in:retail,wholesale',
        ]);

        Customer::create($data);

        return redirect()->back();
    }

    // SHOW ONE
    public function show($id)
    {
        return Customer::findOrFail($id);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $customer = Customer::findOrFail($id);

        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email,' . $id,
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'type' => 'in:retail,wholesale',
        ]);

        $customer->update($data);

        return $customer;
    }

    // DELETE
    public function destroy($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();

        return response()->json(['message' => 'Customer deleted']);
    }
}