"use client";

import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

// Types
type Product = {
  id: number;
  name: string;
  barcode: string;
  sell_price: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type Props = {
  products: Product[];
};

export default function Create({ products }: Props) {
  const [barcode, setBarcode] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scannerEnabled, setScannerEnabled] = useState<boolean>(false);

  // Add to cart locally
  const addToCart = (scannedBarcode: string) => {
    const product = products.find((p) => p.barcode === scannedBarcode);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Remove from cart locally
  const removeFromCart = (scannedBarcode: string) => {
    setCart((prev) => prev.filter((i) => i.product.barcode !== scannedBarcode));
  };

  // Handle scanning a product
  const handleScan = (scannedBarcode: string) => {
    if (!scannedBarcode) return;

    setBarcode(scannedBarcode);
    addToCart(scannedBarcode);

    router.post("/pos/scan-broadcast", { barcode: scannedBarcode, action: "add" });
  };

  // Handle removing a product
  const handleRemove = (item: CartItem) => {
    removeFromCart(item.product.barcode);

    router.post("/pos/scan-broadcast", {
      barcode: item.product.barcode,
      action: "remove",
    });
  };

  // Polling for updates from server
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/pos/latest-barcode");
        const data: { barcode?: string; action?: "add" | "remove" } =
          await response.json();

        if (!data.barcode || !data.action) return;

        if (data.action === "add") {
          // Prevent duplicates locally
          if (!cart.find((i) => i.product.barcode === data.barcode)) {
            addToCart(data.barcode);
          }
        } else if (data.action === "remove") {
          removeFromCart(data.barcode);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [cart]);

  const total = cart.reduce(
    (sum, item) => sum + item.product.sell_price * item.quantity,
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Sale</h1>

      <div className="flex space-x-2 mb-4">
        <input
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan(barcode)}
          placeholder="Scan or enter barcode"
          className="border rounded p-2 flex-1"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => handleScan(barcode)}
        >
          Add
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setScannerEnabled(!scannerEnabled)}
        >
          {scannerEnabled ? "Stop Scanner" : "Scan"}
        </button>
      </div>

      {scannerEnabled && (
        <div className="w-full h-64 border mb-4">
          <BarcodeScannerComponent
            width={400}
            height={300}
            onUpdate={(err, result) => {
              if (result) {
                handleScan(result.getText());
                setScannerEnabled(false);
              }
            }}
          />
        </div>
      )}

      <table className="w-full border">
        <thead>
          <tr>
            <th className="p-2 text-left">Product</th>
            <th className="p-2">Quantity</th>
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
                  onClick={() => handleRemove(item)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-bold mt-4">Total: R {total}</h2>
    </div>
  );
}
