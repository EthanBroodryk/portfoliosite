"use client";

import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage, router } from "@inertiajs/react";
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

export default function StockMovements() {
  const page = usePage<{
    stock_movements: {
      data?: any[];
      links?: any[];
      from?: number;
      to?: number;
      total?: number;
      per_page?: number;
    };
    branches: { id: number; name: string }[];
    users: { id: number; name: string }[];
    filters: any;
  }>();

  const { stock_movements = {}, branches = [], users = [] } = page.props;

  // --- handle data safely ---
  const data = stock_movements.data ?? [];
  const links = stock_movements.links ?? [];
  const meta = {
    from: stock_movements.from ?? 0,
    to: stock_movements.to ?? 0,
    total: stock_movements.total ?? 0,
    per_page: stock_movements.per_page ?? page.props.filters.per_page ?? 5,
  };

  // --------------------------
  // FILTERS + PAGE SIZE
  // --------------------------
  const [filters, setFilters] = useState({
    type: page.props.filters.type || "",
    branch_id: page.props.filters.branch_id || "",
    user_id: page.props.filters.user_id || "",
    date_from: page.props.filters.date_from || "",
    date_to: page.props.filters.date_to || "",
    per_page: page.props.filters.per_page || 5, // default rows per page
  });

  const applyFilters = () => {
    router.get("/stock", { ...filters, page: 1 }, { preserveState: true, preserveScroll: true });
  };

  const handlePageChange = (url: string) => {
    router.get(url, { ...filters }, { preserveState: true, preserveScroll: true });
  };

  const handlePerPageChange = (perPage: number) => {
    setFilters((prev) => ({ ...prev, per_page: perPage }));
    router.get(
      "/stock",
      { ...filters, per_page: perPage, page: 1 },
      { preserveState: true, preserveScroll: true }
    );
  };

  // --------------------------
  // BREADCRUMBS
  // --------------------------
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Stock", href: "/stock" },
    { title: "Stock Movements", href: "/stock" },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Stock Movements" />

      <div className="p-6 md:p-8 rounded-xl shadow-sm bg-card text-card-foreground">
        <h1 className="text-2xl font-semibold mb-4">Stock Movements</h1>

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="text-sm">Type</label>
            <select
              className="w-full p-2 border rounded bg-background"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
              <option value="TRANSFER">TRANSFER</option>
            </select>
          </div>

          <div>
            <label className="text-sm">Branch</label>
            <select
              className="w-full p-2 border rounded bg-background"
              value={filters.branch_id}
              onChange={(e) => setFilters({ ...filters, branch_id: e.target.value })}
            >
              <option value="">All</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">User</label>
            <select
              className="w-full p-2 border rounded bg-background"
              value={filters.user_id}
              onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
            >
              <option value="">All</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">Date From</label>
            <input
              type="date"
              className="w-full p-2 border rounded bg-background"
              value={filters.date_from}
              onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm">Date To</label>
            <input
              type="date"
              className="w-full p-2 border rounded bg-background"
              value={filters.date_to}
              onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
            />
          </div>
        </div>

        {/* APPLY FILTERS INLINE */}
        <div className="flex justify-end mb-4">
          <Button onClick={applyFilters} className="bg-blue-600 text-white px-6">
            Apply Filters
          </Button>
        </div>

        {/* ROWS PER PAGE + RIGHT ALIGNED INDICATOR */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm">Rows per page:</span>

          <select
            className="p-2 border rounded bg-background"
            value={filters.per_page}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
          >
            {[5, 10, 25, 50, 100, 250].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <span className="ml-auto text-sm opacity-80">
            Showing {meta.from} to {meta.to} of {meta.total}
          </span>
        </div>

        {/* TABLE */}
        <Table>
          <TableCaption>All stock movements recorded in the system.</TableCaption>

          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Branch</TableHead>
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
            {data.length > 0 ? (
              data.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.id}</TableCell>
                  <TableCell>{movement.type}</TableCell>
                  <TableCell>{movement.sku}</TableCell>
                  <TableCell>{movement.branch?.name ?? "-"}</TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.from_location || "-"}</TableCell>
                  <TableCell>{movement.to_location || "-"}</TableCell>
                  <TableCell>{new Date(movement.movement_date).toLocaleString()}</TableCell>
                  <TableCell>{movement.reference || "-"}</TableCell>
                  <TableCell>{movement.user?.name ?? movement.performed_by ?? "-"}</TableCell>
                  <TableCell>{movement.cost_per_unit ? `R ${movement.cost_per_unit}` : "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center opacity-70 py-6">
                  No stock movements recorded.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={11}
                className="text-left opacity-80"
              >
                Showing {meta.from} to {meta.to} of {meta.total}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* PAGINATION */}
        <div className="flex items-center justify-end space-x-3 py-4 pr-2">
          {links.map((link: any, index: number) => (
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
    </AppLayout>
  );
}