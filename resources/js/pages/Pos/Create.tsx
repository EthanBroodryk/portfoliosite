"use client";

import React, { useState } from "react";
import { router } from "@inertiajs/react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

type Product = {
  id: number;
  name: string;
  clean_barcode: string;
  sell_price: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type CreateProps = {
  products: Product[];
};

export default function Create({ products }: CreateProps) {
  const [barcode, setBarcode] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scannerEnabled, setScannerEnabled] = useState<boolean>(false);

  const addToCart = (scannedBarcode: string) => {
    const normalized = scannedBarcode.trim();
    const product = products.find(
      (p) => p.clean_barcode?.trim() === normalized
    );

    if (!product) {
      alert("Product not found");
      return;
    }

    setCart((prev) => {
      const exists = prev.find((i) => i.product.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    setBarcode("");
  };

  const handleScan = (code: string) => {
    if (!code) return;
    addToCart(code);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.product.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.product.sell_price * item.quantity,
    0
  );

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Inventory", href: "/products" },
    { title: "All Products", href: "/products" },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="POS - Create Sale" />

      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Create Sale</h1>

        {/* INPUT + BUTTONS */}
        <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 mb-4">
          <input
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan(barcode)}
            placeholder="Scan or enter barcode"
            className="border rounded p-2 w-full"
          />

          <button
            className="bg-blue-600 w-full md:w-auto text-white px-4 py-2 rounded"
            onClick={() => handleScan(barcode)}
          >
            Add
          </button>

          <button
            className="bg-green-600 w-full md:w-auto text-white px-4 py-2 rounded"
            onClick={() => setScannerEnabled(!scannerEnabled)}
          >
            {scannerEnabled ? "Stop Scanner" : "Scan"}
          </button>
        </div>

        {/* BARCODE SCANNER */}
        {scannerEnabled && (
          <div className="w-full border rounded mb-4 flex justify-center">
            <BarcodeScannerComponent
              width={280}
              height={200}
              onUpdate={(err, result) => {
                if (result) {
                  handleScan(result.getText());
                  setScannerEnabled(false);
                }
              }}
            />
          </div>
        )}

        {/* DESKTOP TABLE */}
        <div className="hidden md:block">
          <table className="w-full border text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Product</th>
                <th className="p-2">Qty</th>
                <th className="p-2">Price</th>
                <th className="p-2">Total</th>
                <th className="p-2">Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.product.id}>
                  <td className="p-2">{item.product.name}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">R {item.product.sell_price}</td>
                  <td className="p-2">
                    R {item.product.sell_price * item.quantity}
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
        </div>

        {/* MOBILE CARD VERSION */}
        <div className="md:hidden space-y-3">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="border rounded p-3 flex flex-col space-y-2"
            >
              <div className="font-bold">{item.product.name}</div>
              <div className="text-sm">Quantity: {item.quantity}</div>
              <div className="text-sm">Price: R {item.product.sell_price}</div>
              <div className="text-sm font-semibold">
                Total: R {item.product.sell_price * item.quantity}
              </div>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => removeFromCart(item.product.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <h2 className="text-xl font-bold mt-4">Total: R {total}</h2>
      </div>
    </AppLayout>
  );
}
