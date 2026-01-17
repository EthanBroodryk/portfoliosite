"use client";

import { FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ProductForm {
  sku: string;
  name: string;
  cost_price: number | string;
  sell_price: number | string;
}

export default function Create() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Inventory", href: "/products/create" },
    { title: "Create Product", href: "/products/create" },
  ];

  const { data, setData, post, processing, errors } = useForm<ProductForm>({
    sku: "",
    name: "",
    cost_price: "",
    sell_price: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post("/products");
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Product" />

      <div className="flex justify-center py-10">
        <div className="w-full max-w-md p-6 border rounded-md shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Create Product</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* SKU */}
            <div className="space-y-1">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                placeholder="Enter SKU"
                value={data.sku}
                onChange={(e) => setData("sku", e.target.value)}
              />
              {errors.sku && (
                <p className="text-red-500 text-sm">{errors.sku}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Cost Price */}
            <div className="space-y-1">
              <Label htmlFor="cost_price">Cost Price</Label>
              <Input
                id="cost_price"
                type="number"
                placeholder="Enter cost price"
                value={data.cost_price}
                onChange={(e) => setData("cost_price", e.target.value)}
              />
              {errors.cost_price && (
                <p className="text-red-500 text-sm">{errors.cost_price}</p>
              )}
            </div>

            {/* Sell Price */}
            <div className="space-y-1">
              <Label htmlFor="sell_price">Sell Price</Label>
              <Input
                id="sell_price"
                type="number"
                placeholder="Enter sell price"
                value={data.sell_price}
                onChange={(e) => setData("sell_price", e.target.value)}
              />
              {errors.sell_price && (
                <p className="text-red-500 text-sm">{errors.sell_price}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-4" disabled={processing}>
              {processing ? "Saving..." : "Save Product"}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
