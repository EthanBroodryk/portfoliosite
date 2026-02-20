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

export default function Index() {
  const page = usePage<{
    stock_movements: {
      data: Array<any>;
      links: any[];
      meta: any;
    };
    branches: Array<{ id: number; name: string }>;
    users: Array<{ id: number; name: string }>;
    filters: any;
  }>();

  // --------------------------
  // TABLE DATA + PAGINATION
  // --------------------------
  const table = page.props.stock_movements ?? {};
  const stock_movements = table.data ?? [];
  const links = table.links ?? [];
  const pagination = table.meta ?? { from: 0, to: 0, total: 0 };

  const branches = page.props.branches;
  const users = page.props.users;

  // --------------------------
  // FILTERS + PAGE SIZE
  // --------------------------
  const [filters, setFilters] = useState({
    type: page.props.filters.type || "",
    branch_id: page.props.filters.branch_id || "",
    user_id: page.props.filters.user_id || "",
    date_from: page.props.filters.date_from || "",
    date_to: page.props.filters.date_to || "",
    per_page: page.props.filters.per_page || 5, // <-- default 5
  });

  const applyFilters = () => {
    router.get("/stock", filters, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handlePageChange = (url: string) => {
    router.get(url, { ...filters }, { preserveState: true, preserveScroll: true });
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {/* Type Filter */}
          <div>
            <label className="text-sm">Type</label>
            <select
              className="w-full p-2 border rounded"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All</option>
              <option value="IN">IN</option>
              <option value="OUT">OUT</option>
              <option value="TRANSFER">TRANSFER</option>
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <label className="text-sm">Branch</label>
            <select
              className="w-full p-2 border rounded"
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

          {/* User Filter */}
          <div>
            <label className="text-sm">User</label>
            <select
              className="w-full p-2 border rounded"
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

          {/* Date From */}
          <div>
            <label className="text-sm">Date From</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={filters.date_from}
              onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
            />
          </div>

          {/* Date To */}
          <div>
            <label className="text-sm">Date To</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={filters.date_to}
              onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
            />
          </div>
        </div>

        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-600 text-white rounded mb-6"
        >
          Apply Filters
        </button>

        {/* ROWS PER PAGE */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm">Rows per page:</span>
          <select
            className="p-2 border rounded"
            value={filters.per_page}
            onChange={(e) => {
              const val = Number(e.target.value);
              setFilters({ ...filters, per_page: val });
              router.get("/stock", { ...filters, per_page: val, page: 1 }, { preserveScroll: true, preserveState: true });
            }}
          >
            {[5, 10, 25, 50, 100, 250].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <span className="ml-auto text-sm text-gray-600">
            Showing {pagination.from ?? 0} - {pagination.to ?? 0} of {pagination.total ?? 0}
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
            {stock_movements.length > 0 ? (
              stock_movements.map((movement) => (
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
                <TableCell colSpan={11} className="text-center text-gray-500 py-6">
                  No stock movements recorded.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={11}>Total Records: {pagination.total ?? 0}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* PAGINATION BUTTONS */}
        <div className="flex items-center justify-end space-x-3 py-4 pr-6">
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