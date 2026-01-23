"use client";

import * as React from "react";
import JsBarcode from "jsbarcode";
import { Link, Head } from "@inertiajs/react";
import axios from "axios";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type PaginationState,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";

export type Product = {
  id: number;
  sku: string;
  name: string;
  sell_price: number | string;
  barcode: string | null;
};

interface Props {
  products?: Product[];
}

export default function Index({ products = [] }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Inventory", href: "/products" },
    { title: "All Products", href: "/products" },
  ];

  // Table state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  // Generate barcode SVGs after render
  React.useEffect(() => {
    products.forEach((product) => {
      const id = product.id;
      const sku = product.sku;

      if (!sku) return;

      try {
        JsBarcode(`#barcode-${id}`, sku, {
          format: "CODE128",
          width: 3,       // thicker bars for better scanning
          height: 100,    // taller bars
          displayValue: true,
        });
      } catch (e) {
        console.error("Barcode generation error:", e);
      }
    });
  }, [products, pagination]);

  // Columns
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "sku",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SKU <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("sku")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "sell_price",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sell Price <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>R {row.getValue("sell_price")}</div>,
    },
    {
      accessorKey: "barcode",
      header: "Barcode",
      cell: ({ row }) => {
        const id = row.original.id;
        const sku = row.original.sku;
        if (!sku) return <span>No Barcode</span>;

        return (
          <div className="flex flex-col items-center space-y-2">
            <svg
              id={`barcode-${id}`}
              className="h-24 w-full max-w-xs"
            ></svg>
            <span className="text-sm">{sku}</span>
            <button
              size="sm"
              className="border px-2 py-1 rounded text-sm"
              onClick={() => window.print()}
            >
              Print
            </button>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex space-x-2">
            <Link
              href={`/products/${product.id}/edit`}
              className="px-2 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600 text-sm"
            >
              Edit
            </Link>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                if (!confirm("Are you sure you want to delete this product?")) return;

                try {
                  await axios.delete(`/products/${product.id}`);
                  location.reload();
                } catch (err: any) {
                  console.error("Delete failed:", err.response || err);
                  alert("Failed to delete product. Check console for details.");
                }
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, columnFilters, columnVisibility, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: false,
    pageCount: Math.ceil(products.length / pagination.pageSize),
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="All Products" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Products</h1>
          <Link
            href="/products/create"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Product
          </Link>
        </div>

        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by Name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                  >
                    {col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No products yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <select
            className="ml-2 border rounded p-1"
            value={pagination.pageSize}
            onChange={(e) =>
              setPagination((p) => ({ ...p, pageSize: Number(e.target.value), pageIndex: 0 }))
            }
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </AppLayout>
  );
}
