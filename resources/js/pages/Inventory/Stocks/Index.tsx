import React from "react";
import { usePage, Link } from "@inertiajs/react";

interface Product {
    id: number;
    name: string;
}

interface Branch {
    id: number;
    name: string;
}

interface Stock {
    id: number;
    quantity: number;
    product: Product;
    branch: Branch;
}

export default function Index() {
    const { stocks } = usePage().props as { stocks: any };

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Stock Movements</h1>

                <Link
                    href="/stock/create"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                    Add Movement
                </Link>
            </div>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 text-left border">Product</th>
                        <th className="p-2 text-left border">Branch</th>
                        <th className="p-2 text-left border">Quantity</th>
                    </tr>
                </thead>

                <tbody>
                    {stocks.data.map((stock: Stock) => (
                        <tr key={stock.id} className="border-b">
                            <td className="p-2 border">{stock.product.name}</td>
                            <td className="p-2 border">{stock.branch.name}</td>
                            <td className="p-2 border">{stock.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-4 flex gap-2">
                {stocks.links.map((link: any, idx: number) => (
                    <Link
                        key={idx}
                        href={link.url || ""}
                        className={`px-3 py-1 border rounded ${
                            link.active ? "bg-blue-500 text-white" : ""
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
