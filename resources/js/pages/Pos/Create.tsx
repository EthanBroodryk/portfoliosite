"use client";

import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

type Product = {
  id: number;
  sku: string;
  name: string;
  sell_price: number | string;
  barcode: string | null;
};

interface Props {
  products: Product[];
}

type CartItem = {
  product: Product;
  quantity: number;
};

export default function Create({ products }: Props) {


    const breadcrumbs: BreadcrumbItem[] = [
      { title: "Inventory", href: "/products" },
      { title: "All Products", href: "/products" },
    ];


  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scannerEnabled, setScannerEnabled] = useState(false);

  const addToCart = (barcodeInput: string) => {
    const product = products.find((p) => p.barcode === barcodeInput);
    if (!product) return alert("Product not found");

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setBarcode(""); // clear input
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.product.sell_price) * item.quantity,
    0
  );

  const handleSubmit = () => {
    router.post("/pos/sale", {
      items: cart.map((c) => ({
        product_id: c.product.id,
        quantity: c.quantity,
      })),
    });
  };

  return (
  <AppLayout breadcrumbs={breadcrumbs}>
    <Head title="All Products" />
    <div className="p-6">
      <Head title="Create Sale" />
      <h1 className="text-2xl font-bold mb-4">Create Sale</h1>

      {/* Barcode Input + Scanner Toggle */}
      <div className="flex flex-col space-y-2 mb-4">
        <div className="flex space-x-2">
          <input
            placeholder="Scan or enter barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addToCart(barcode)}
            className="border rounded p-2 flex-1"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => addToCart(barcode)}
          >
            Add
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => setScannerEnabled((prev) => !prev)}
          >
            {scannerEnabled ? "Stop Scanner" : "Scan Barcode"}
          </button>
        </div>

        {scannerEnabled && (
          <div className="w-full h-64 border mt-2">
            <BarcodeScannerComponent
              width={400}
              height={300}
              onUpdate={(err, result) => {
                if (result) {
                  setBarcode(result.getText());
                  addToCart(result.getText());
                  setScannerEnabled(false); // stop scanner after scanning
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Cart Table */}
      <table className="w-full border mb-4">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Product</th>
            <th className="p-2">Price</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Total</th>
            <th className="p-2">Remove</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.product.id} className="border-b">
              <td className="p-2">{item.product.name}</td>
              <td className="p-2">R {item.product.sell_price}</td>
              <td className="p-2">
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) =>
                    updateQuantity(item.product.id, Number(e.target.value))
                  }
                  className="w-16 border rounded p-1"
                />
              </td>
              <td className="p-2">
                R {Number(item.product.sell_price) * item.quantity}
              </td>
              <td className="p-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Total: R {total}</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
          disabled={cart.length === 0}
        >
          Complete Sale
        </button>
      </div>
    </div>
  </AppLayout>
  );
}
