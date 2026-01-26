"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";
import axios from 'axios';

type Product = {
  id: number;
  name: string;
  clean_barcode: string;
  sell_price: number;
};

type CartItem = {
  product_id: number;
  name: string;
  sell_price: number;
  quantity: number;
  clean_barcode?: string;
};

type CreateProps = {
  products: Product[];
};

export default function Create({ products }: CreateProps) {
  const [barcode, setBarcode] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [scannerEnabled, setScannerEnabled] = useState<boolean>(false);

  // ----- ADD TO CART -----
  const addToCart = async (code: string) => {
    if (!code) return;

    try {
      const { data } = await axios.post("/pos/scan", { barcode: code });
      setCart(data.cart);
      setBarcode("");
    } catch (err: any) {
      alert(err.response?.data?.error || "Product not found");
      console.error("Add to cart error:", err);
    }
  };

  // ----- REMOVE FROM CART -----
  const removeFromCart = async (item: CartItem) => {
    try {
      const { data } = await axios.post("/pos/remove", { barcode: item.clean_barcode || item.name });
      setCart(data.cart);
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };


  // ----- increase quentity -------



  const increaseQty = async (item: CartItem) => {
    try {
      const { data } = await axios.post("/pos/increase", {
        barcode: item.clean_barcode,
      });
      setCart(data.cart);
    } catch (err) {
      console.error("Increase qty error:", err);
    }
  };



  //--- decrease quantity -----
  const decreaseQty = async (item: CartItem) => {
  try {
    const { data } = await axios.post("/pos/decrease", {
      barcode: item.clean_barcode,
    });
    setCart(data.cart);
  } catch (err) {
    console.error("Decrease qty error:", err);
  }
};



// ---- clear cart ------

const clearCart = async () => {
  try {
    const { data } = await axios.post("/pos/clear");
    setCart(data.cart);
  } catch (err) {
    console.error("Clear cart error:", err);
  }
};



//-----finalize sale ------

const finalizeSale = async () => {
  if (cart.length === 0) return;

  try {
    const { data } = await axios.post("/pos/checkout", {
      cart,
      payment_method: "cash", // hardcoded for now
      amount_received: cart.reduce((sum, item) => sum + item.sell_price * item.quantity, 0),
    });

    // clear cart locally
    setCart([]);

    // show success message or receipt
    alert(`Sale completed! Invoice: ${data.invoice_number}`);
  } catch (err: any) {
    console.error("Checkout error:", err);
    alert(err.response?.data?.error || "Failed to complete sale");
  }
};








  // ----- POLLING -----
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get("/pos/latest-cart");
        setCart(data.cart);
      } catch (err) {
        console.error("Polling cart error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.sell_price * item.quantity, 0);

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
            onKeyDown={(e) => e.key === "Enter" && addToCart(barcode)}
            placeholder="Scan or enter barcode"
            className="border rounded p-2 w-full"
          />
          <button
            className="bg-blue-600 w-full md:w-auto text-white px-4 py-2 rounded"
            onClick={() => addToCart(barcode)}
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
                  addToCart(result.getText());
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
                <tr key={item.product_id}>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">R {item.sell_price}</td>
                  <td className="p-2">R {item.sell_price * item.quantity}</td>


                  <td className="p-2 flex items-center space-x-2">
                    <button
                      className="bg-amber-500 px-2 rounded"
                      onClick={() => decreaseQty(item)}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      className="bg-green-700 px-2 rounded"
                      onClick={() => increaseQty(item)}
                    >
                      +
                    </button>
                  </td>

                  <td className="p-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => removeFromCart(item)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-3">
          {cart.map((item) => (
            <div key={item.product_id} className="border rounded p-3 flex flex-col space-y-2">
              <div className="font-bold">{item.name}</div>
              <div className="text-sm">Quantity: {item.quantity}</div>
              <div className="text-sm">Price: R {item.sell_price}</div>
              <div className="text-sm font-semibold">
                Total: R {item.sell_price * item.quantity}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="bg-amber-500 px-2 rounded"
                  onClick={() => decreaseQty(item)}
                >
                  -
                </button>

                <span className="text-sm">Qty: {item.quantity}</span>

                <button
                  className="bg-green-700 px-2 rounded"
                  onClick={() => increaseQty(item)}
                >
                  +
                </button>
              </div>

              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => removeFromCart(item)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

          {/* Clear Cart Button for mobile */}
          {/* Only show if cart has items */}
          {cart.length > 0 && (
            <div className="mt-4 flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto"
                onClick={finalizeSale} 
              >
                Finalize Sale
              </button>

              <button
                className="bg-red-700 text-white px-4 py-2 rounded w-full md:w-auto"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          )}



        <h2 className="text-xl font-bold mt-4">Total: R {total}</h2>
      </div>
    </AppLayout>
  );
}
