"use client";

import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import axios from "axios";
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

// Import YOUR modal component
import SaleDetailsDialog from "./components/SaleDetailsDialog";


type Sale = {
  id: number;
  invoice_number: string;
  user_id: number;
  customer_id: number | null;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amount_received: number;
  change_due: number;
  payment_method: string;
  status: string;
  note: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

export default function Sales({ sales }: { sales: Sale[] }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Pos", href: "/pos/sales" },
    { title: "Sales", href: "/pos/sales" },
  ];

  // Modal State
  const [open, setOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Sale Items + Open Modal
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
              {sales.map((sale) => (
                <TableRow
                  key={sale.id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => openSale(sale.id)}
                >
                  <TableCell className="font-medium">
                    {sale.invoice_number}
                  </TableCell>

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
                <TableCell colSpan={5} className="font-semibold">
                  Total Sales
                </TableCell>
                <TableCell className="text-right font-semibold">
                  R{" "}
                  {sales
                    .reduce((sum, s) => sum + Number(s.total), 0)
                    .toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>

      {/* ------------------------- */}
      {/* USE YOUR REUSABLE DIALOG  */}
      {/* ------------------------- */}
      <SaleDetailsDialog
        open={open}
        onClose={() => setOpen(false)}
        sale={selectedSale}
        items={items}
      />
    </AppLayout>
  );
}
