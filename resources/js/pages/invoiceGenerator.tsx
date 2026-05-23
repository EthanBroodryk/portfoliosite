"use client";

import { useState, FormEvent } from "react";
import { useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function GenerateInvoice() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Invoice Generator", href: "/invoice-generator" },
    { title: "Generate Invoice", href: "/invoice-generator" },
  ];

  const { props } = usePage();
  const invoices = props.invoices || [];

  const [mode, setMode] = useState<"list" | "create">("list");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    client_name: "",
    email: "",
    invoice_number: "",
    amount: "",
    status: "pending",
    logo: null as File | null,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();

    post("/invoices", {
      forceFormData: true,
      onSuccess: () => {
        reset();
        setMode("list"); // 👈 go back to list after save
      },
    });
  };

  const openInvoice = (invoice: any) => setSelectedInvoice(invoice);
  const closeModal = () => setSelectedInvoice(null);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Generate Invoice" />

      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              {mode === "list" ? "All Invoices" : "Create Invoice"}
            </h1>

            {mode === "list" ? (
              <Button onClick={() => setMode("create")}>
                Create Invoice
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setMode("list")}>
                Back
              </Button>
            )}
          </div>

          {/* ---------------- CREATE FORM ---------------- */}
          {mode === "create" && (
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">
                <Label>Customer Name</Label>
                <Input value={data.client_name} onChange={(e) => setData("client_name", e.target.value)} />
                {errors.client_name && <p className="text-red-500 text-sm">{errors.client_name}</p>}
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label>Invoice Number</Label>
                <Input value={data.invoice_number} onChange={(e) => setData("invoice_number", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" value={data.amount} onChange={(e) => setData("amount", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={data.status} onValueChange={(v) => setData("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Logo</Label>
                <Input type="file" onChange={(e) => setData("logo", e.target.files?.[0] ?? null)} />
              </div>

              <div className="md:col-span-2 flex justify-end pt-4">
                <Button disabled={processing}>Create Invoice</Button>
              </div>
            </form>
          )}

          {/* ---------------- LIST VIEW ---------------- */}
          {mode === "list" && (
            <table className="w-full text-left border-collapse mt-4">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Client</th>
                  <th>Email</th>
                  <th>Invoice #</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((inv: any) => (
                  <tr
                    key={inv.id}
                    onClick={() => openInvoice(inv)}
                    className="border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <td className="py-2">{inv.client_name}</td>
                    <td>{inv.email}</td>
                    <td>{inv.invoice_number}</td>
                    <td>R {inv.amount}</td>
                    <td>{inv.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ---------------- MODAL ---------------- */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4">

          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden">

            <div className="flex justify-between items-start p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">INVOICE</h2>
                <p className="text-sm text-gray-500">#{selectedInvoice.invoice_number}</p>
              </div>

              {selectedInvoice.logo && (
                <img
                  src={`/storage/${selectedInvoice.logo}`}
                  className="h-12 object-contain"
                  alt="logo"
                />
              )}
            </div>

            <div className="p-6 space-y-6 text-sm">
              <div>
                <p className="text-gray-500">Client</p>
                <p className="font-semibold">{selectedInvoice.client_name}</p>
                <p>{selectedInvoice.email}</p>
              </div>

              <div>
                <p className="text-gray-500">Amount</p>
                <p className="text-xl font-bold">R {selectedInvoice.amount}</p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>
                <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
                  {selectedInvoice.status}
                </span>
              </div>
            </div>

            <div className="flex justify-between p-4 border-t">
              <Button variant="secondary" onClick={closeModal}>Close</Button>
              <Button onClick={() => window.print()}>Print</Button>
            </div>

          </div>
        </div>
      )}
    </AppLayout>
  );
}