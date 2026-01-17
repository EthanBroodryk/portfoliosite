import { Link } from "@inertiajs/react";
import { FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface Product {
  id: number;
  sku: string;
  name: string;
  sell_price: number | string;
}

interface Props {
  products: Product[];
}

export default function Index({ products }: Props) {

    const breadcrumbs: BreadcrumbItem[] = [
      { title: "Inventory", href: "/products" },
      { title: "All Products", href: "/products" }
  ];


  return (


   <AppLayout breadcrumbs={breadcrumbs}>
    <Head title="All Products" />

    <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Products</h1>

            <Link
                href="/products/create"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Create Product
            </Link>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-gray-300">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2 text-left">SKU</th>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Sell Price</th>
                </tr>
            </thead>

            <tbody>
                {products.length > 0 ? (
                    products.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                            <td className="border p-2">{p.sku}</td>
                            <td className="border p-2">{p.name}</td>
                            <td className="border p-2">R {p.sell_price}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={3} className="text-center p-4 text-gray-500">
                            No products yet.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
</AppLayout>



  );


}
