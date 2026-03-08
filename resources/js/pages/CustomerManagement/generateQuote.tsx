"use client";

import { useState } from "react";
import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Customer = {
  id: number;
  name: string;
  phone: string;
};

export default function GenerateQuote() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Quote", href: "/customer/quote" },
    { title: "Create Quote", href: "/customer/quote" },
  ];

  // --- Types ---
  type QuoteItem = {
    product_name: string;
    quantity: number;
    price: number;
  };

  type QuoteForm = {
    customer_id: string;
    valid_until: string;
    items: QuoteItem[];
  };

  // --- State ---
  const [form, setForm] = useState<QuoteForm>({
    customer_id: "",
    valid_until: "",
    items: [{ product_name: "", quantity: 1, price: 0 }],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);

  // --- Handlers ---
  const handleItemChange = <K extends keyof QuoteItem>(
    index: number,
    field: K,
    value: QuoteItem[K]
  ) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm({ ...form, items: updatedItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { product_name: "", quantity: 1, price: 0 }],
    });
  };

  const total = form.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const submit = () => {
    router.post("/quotes", {
      customer_id: form.customer_id,
      valid_until: form.valid_until,
      total: total,
      quote_details: {
        items: form.items,
      },
    });
  };


    const searchCustomer = async (query: string) => {
    setSearchTerm(query);
    if (query.length < 2) {
        setCustomerResults([]);
        return;
    }

    const res = await fetch(`/customer/searchCustomer?query=${encodeURIComponent(query)}`);
    const data: Customer[] = await res.json();
    setCustomerResults(data);
    };

  const selectCustomer = (customer: Customer) => {
    setForm({ ...form, customer_id: customer.id.toString() });
    setSearchTerm(customer.name + " (" + customer.phone + ")");
    setCustomerResults([]);
  };

  // --- JSX ---
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Quote" />

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Quote</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Customer Search */}
            <div className="space-y-2 relative">
              <Label>Customer</Label>
              <Input
                placeholder="Search by name or phone"
                value={searchTerm}
                onChange={(e) => searchCustomer(e.target.value)}
              />

            {customerResults.length > 0 && (
                <div className="absolute bg-white dark:bg-gray-800 border dark:border-gray-700 rounded mt-1 w-full z-10 max-h-60 overflow-y-auto shadow-lg">
                    {customerResults.map((c) => (
                    <div
                        key={c.id}
                        className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => selectCustomer(c)}
                    >
                        {c.name} ({c.phone})
                    </div>
                    ))}
                </div>
                )}
            </div>

            {/* Valid Until */}
            <div className="space-y-2">
              <Label>Valid Until</Label>
              <Input
                type="date"
                value={form.valid_until}
                onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
              />
            </div>

            {/* Quote Items */}
            <div className="space-y-4">
              <Label>Quote Items</Label>

              {form.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 border p-4 rounded-lg"
                >
                  <Input
                    placeholder="Product"
                    value={item.product_name}
                    onChange={(e) =>
                      handleItemChange(index, "product_name", e.target.value)
                    }
                  />

                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", Number(e.target.value))
                    }
                  />

                  <Input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", Number(e.target.value))
                    }
                  />
                </div>
              ))}

              <Button type="button" onClick={addItem}>
                Add Item
              </Button>
            </div>

            {/* Total */}
            <div className="text-lg font-semibold">Total: {total}</div>

            {/* Submit */}
            <Button onClick={submit}>Create Quote</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}