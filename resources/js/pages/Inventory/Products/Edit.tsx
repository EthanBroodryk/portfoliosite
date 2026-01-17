"use client";

import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

interface Props {
  product: {
    id: number;
    sku: string;
    name: string;
    cost_price: number;
    sell_price: number;
  };
}

export default function Edit({ product }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Inventory", href: "/products" },
    { title: "Edit Product", href: `/products/${product.id}/edit` },
  ];

  const { data, setData, put, processing, errors } = useForm({
    sku: product.sku,
    name: product.name,
    cost_price: product.cost_price,
    sell_price: product.sell_price,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(`/products/${product.id}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Product" />

      <div className="flex justify-center py-10">
        <div className="w-full max-w-md p-6 border rounded-md shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={data.sku}
                onChange={(e) => setData("sku", e.target.value)}
              />
              {errors.sku && <p className="text-red-500 text-sm">{errors.sku}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="cost_price">Cost Price</Label>
              <Input
                id="cost_price"
                type="number"
                value={data.cost_price}
                onChange={(e) => setData("cost_price", e.target.value)}
              />
              {errors.cost_price && (
                <p className="text-red-500 text-sm">{errors.cost_price}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="sell_price">Sell Price</Label>
              <Input
                id="sell_price"
                type="number"
                value={data.sell_price}
                onChange={(e) => setData("sell_price", e.target.value)}
              />
              {errors.sell_price && (
                <p className="text-red-500 text-sm">{errors.sell_price}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-4" disabled={processing}>
              {processing ? "Updating..." : "Update Product"}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
