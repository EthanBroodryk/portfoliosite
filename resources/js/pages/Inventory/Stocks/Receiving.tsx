"use client";

import { useState } from "react";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Receiving() {
  const { receiving_types, branches, users } = usePage().props;

  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [supplierName, setSupplierName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [receivedAt, setReceivedAt] = useState("");

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Stock", href: "/stocks/receiving" },
    { title: "Receiving", href: "/stocks/receiving" },
  ];

  // Find the selected receiving type object
  const selectedTypeObj = receiving_types.find(
    (t: any) => t.id === selectedTypeId
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Receiving" />

      <div className="p-6 md:p-8 rounded-xl shadow-sm bg-card text-card-foreground">

        {/* FILTERS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">

          {/* Receiving Type */}
          <div>
            <Label className="text-sm">Receiving Type</Label>
            <select
              className="w-full p-2 border rounded"
              value={selectedTypeId ?? ""}
              onChange={(e) => {
                const id = Number(e.target.value) || null;
                setSelectedTypeId(id);

                // DEBUG
                const selected = receiving_types.find(t => t.id === id);
                console.log("Selected ID:", id);
                console.log("selectedTypeObj:", selected);
                console.log("selectedTypeObj.name:", selected?.name);
              }}
            >
              <option value="">All</option>
              {receiving_types.map((type: any) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <Label className="text-sm">Branch</Label>
            <select className="w-full p-2 border rounded">
              <option value="">All</option>
              {branches.map((b: any) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* User Filter */}
          <div>
            <Label className="text-sm">User</Label>
            <select className="w-full p-2 border rounded">
              <option value="">All</option>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <Label className="text-sm">Date From</Label>
            <Input type="date" className="w-full" />
          </div>

          {/* Date To */}
          <div>
            <Label className="text-sm">Date To</Label>
            <Input type="date" className="w-full" />
          </div>

        </div>

        {/* Supplier Receiving Form */}
        {selectedTypeObj?.name === "SUPPLIER" && (
          <div className="mt-6 border-t pt-6 space-y-4">

            <h2 className="text-lg font-semibold">Supplier Receiving Form</h2>

            <div>
              <Label>Supplier Name</Label>
              <Input
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Enter supplier name"
              />
            </div>

            <div>
              <Label>Invoice Number</Label>
              <Input
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Enter invoice number"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <textarea
                className="w-full p-2 border rounded"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes"
              />
            </div>

            <div>
              <Label>Received At</Label>
              <Input
                type="date"
                value={receivedAt}
                onChange={(e) => setReceivedAt(e.target.value)}
              />
            </div>

            <Button
              className="mt-4"
              onClick={() => {
                console.log("Submit Supplier Receiving:", {
                  supplierName,
                  invoiceNumber,
                  notes,
                  receivedAt,
                  type: selectedTypeObj.label
                });
              }}
            >
              Submit Supplier Receiving
            </Button>

          </div>
        )}

      </div>
    </AppLayout>
  );
}
