"use client";

import * as React from "react";
import JsBarcode from "jsbarcode";
import { Link, Head } from "@inertiajs/react";
import axios from "axios";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Index({ products }: { products: any }) {
  const [showModal, setShowModal] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);

  React.useEffect(() => {
    products.forEach((p: any) => {
      if (!p.sku) return;

      try {
        JsBarcode(`#barcode-${p.id}`, p.sku, {
          format: "CODE128",
          width: 2,
          height: 60,
          displayValue: false,
        });
      } catch (e) {
        console.log("Barcode error:", e);
      }
    });
  }, [products]);

  // Generate barcode when modal opens
  React.useEffect(() => {
    if (selectedProduct) {
      setTimeout(() => {
        JsBarcode(`#modal-barcode`, selectedProduct.sku, {
          format: "CODE128",
          width: 4,
          height: 150,
          displayValue: true,
        });
      }, 50);
    }
  }, [selectedProduct]);

  const openModal = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const printBarcode = () => {
    const printContent = document.getElementById("modal-barcode")?.outerHTML;

    const win = window.open("", "_blank");
    win?.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
        </head>
        <body style="text-align:center; margin-top:40px;">
          ${printContent}
        </body>
      </html>
    `);

    win?.document.close();
    win?.print();
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Products", href: "/products" },
    { title: "All Products", href: "/products" },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Products" />

      {/* Table */}
      <div className="p-6 md:p-8 rounded-xl shadow-sm">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[700px]">
            <TableCaption>All Products</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Re-order Level</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>Sell Price</TableHead>
                <TableHead>Is Active</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{p.sku}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.category?.name ?? "Unassigned"}</TableCell>

                  <TableCell
                    onClick={() => openModal(p)}
                    className="cursor-pointer"
                  >
                    <svg
                      id={`barcode-${p.id}`}
                      className="h-24 w-full max-w-[120px]"
                    ></svg>
                  </TableCell>

                  <TableCell>{p.unit}</TableCell>
                  <TableCell>{p.reorder_level}</TableCell>
                  <TableCell>R {Number(p.cost_price).toFixed(2)}</TableCell>
                  <TableCell>R {Number(p.sell_price).toFixed(2)}</TableCell>
                  <TableCell>{p.is_active ? "Yes" : "No"}</TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={10}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] shadow-xl">
            <h2 className="text-xl font-semibold mb-4">
              Barcode for {selectedProduct.name}
            </h2>

            <div className="flex justify-center mb-4">
              <svg id="modal-barcode" className="w-full"></svg>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Close
              </button>

              <button
                onClick={printBarcode}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Print Barcode
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
