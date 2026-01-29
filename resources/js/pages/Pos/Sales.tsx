"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";

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

import SaleDetailsDialog from "./components/SaleDetailsDialog";

export default function Sales({ sales }: { sales: any }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Pos", href: "/pos/sales" },
    { title: "Sales", href: "/pos/sales" },
  ];

  // --------------------------
  // FILTERS + PAGE SIZE
  // --------------------------
  const [filters, setFilters] = useState({
    invoice: "",
    status: "",
    method: "",
    user: "",
    date: "",
    pageSize: sales.per_page || 20,
  });

  const applyFilters = () => {
    router.get(
      "/pos/sales",
      { ...filters, page: 1 }, // reset to first page
      { preserveState: true, replace: true }
    );
  };

  const handlePageSizeChange = (size: number) => {
    setFilters((prev) => ({ ...prev, pageSize: size }));
    router.get(
      "/pos/sales",
      { ...filters, pageSize: size, page: 1 }, // reset to first page
      { preserveState: true, replace: true }
    );
  };

  const handlePageChange = (url: string) => {
    router.get(url, { pageSize: filters.pageSize }, { preserveState: true });
  };

  // --------------------------
  // MODAL LOGIC
  // --------------------------
  const [open, setOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const openSale = async (saleId: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/pos/sales/${saleId}/items`);
      setSelectedSale(response.data.sale);
      setItems(response.data.items);
      setOpen(true);
    } catch (err) {
      console.error("Error loading sale details", err);
    }
    setLoading(false);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="POS - Sales" />

      <div className="p-6 md:p-8 rounded-xl shadow-sm">
        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <input
            type="text"
            placeholder="Invoice #"
            className="border p-2 rounded"
            value={filters.invoice}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, invoice: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Status"
            className="border p-2 rounded"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Method"
            className="border p-2 rounded"
            value={filters.method}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, method: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Sale made by"
            className="border p-2 rounded"
            value={filters.user}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, user: e.target.value }))
            }
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={filters.date}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, date: e.target.value }))
            }
          />
          <Button onClick={applyFilters} className="bg-blue-600 text-white">
            Apply Filters
          </Button>
        </div>

        {/* PAGE SIZE SELECTOR */}
        <div className="flex justify-end mb-3">
          <select
            value={filters.pageSize}
            className="border rounded p-2"
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 20, 30, 40, 50].map((n) => (
              <option key={n} value={n}>
                Show {n}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[700px]">
            <TableCaption>Your recent sales</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Invoice #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Sale made by</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sales.data.map((sale: any) => (
                <TableRow
                  key={sale.id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => openSale(sale.id)}
                >
                  <TableCell>{sale.invoice_number}</TableCell>
                  <TableCell>{sale.status}</TableCell>
                  <TableCell>{sale.payment_method}</TableCell>
                  <TableCell>{sale.user?.name ?? "Unknown"}</TableCell>
                  <TableCell>
                    {new Date(sale.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    R {Number(sale.total).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  Showing {sales.from} to {sales.to} of {sales.total} results
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-end space-x-3 py-4 pr-6">
          {sales.links.map((link: any, index: number) => (
            <Button
              key={index}
              variant={link.active ? "default" : "outline"}
              size="sm"
              disabled={!link.url}
              onClick={() => link.url && handlePageChange(link.url)}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>

      {/* SALE DETAILS MODAL */}
      <SaleDetailsDialog
        open={open}
        onClose={() => setOpen(false)}
        sale={selectedSale}
        items={items}
      />
    </AppLayout>
  );
}
