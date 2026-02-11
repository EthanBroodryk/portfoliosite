"use client";

import React from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
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

export default function Index() {


    const page = usePage<{
        stock_movements: Array<{
            id: number;
            type: string;
            sku: string;
            quantity: number;
            from_location: string | null;
            to_location: string | null;
            movement_date: string;
            reference: string | null;
            performed_by: string;
            cost_per_unit: number | null;
        }>;
        }>();

const stock_movements = page.props.stock_movements;


  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Stock", href: "/stock" },
    { title: "Stock Movements", href: "/stock" },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Stock Movements" />

    <div className="p-6 md:p-8 rounded-xl shadow-sm bg-card text-card-foreground">
        <h1 className="text-2xl font-semibold mb-6">Stock Movements</h1>

        <Table>
          <TableCaption>All stock movements recorded in the system.</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Cost/unit</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {stock_movements.length > 0 ? (
              stock_movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.id}</TableCell>
                  <TableCell>{movement.type}</TableCell>
                  <TableCell>{movement.sku}</TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.from_location || "-"}</TableCell>
                  <TableCell>{movement.to_location || "-"}</TableCell>
                  <TableCell>
                    {new Date(movement.movement_date).toLocaleString()}
                  </TableCell>
                  <TableCell>{movement.reference || "-"}</TableCell>
                  <TableCell>{movement.performed_by}</TableCell>
                  <TableCell>
                    {movement.cost_per_unit !== null
                      ? `R ${movement.cost_per_unit}`
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-gray-500 py-6">
                  No stock movements recorded.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={10}>Total Records: {stock_movements.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </AppLayout>
  );
}
