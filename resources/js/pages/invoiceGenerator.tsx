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

  // ✅ Updated Form Architecture matching exact model structure
  const { data, setData, post, processing, errors, reset } = useForm({
    client_name: "",
    email: "",
    invoice_number: "",
    invoice_date: new Date().toISOString().split('T')[0], // Defaults to today's date format
    amount: "",
    description: "",
    bank_name: "",
    account_type: "checking",
    branch_code: "",
    account_number: "",
    logo: null as File | null,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();

    post("/invoices", {
      forceFormData: true,
      onSuccess: () => {
        reset();
        setMode("list");
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

          {/* HEADER LAYER */}
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

          {/* ---------------- CREATE FORM VIEW ---------------- */}
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
                {errors.invoice_number && <p className="text-red-500 text-sm">{errors.invoice_number}</p>}
              </div>

              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Input type="date" value={data.invoice_date} onChange={(e) => setData("invoice_date", e.target.value)} />
                {errors.invoice_date && <p className="text-red-500 text-sm">{errors.invoice_date}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Amount</Label>
                <Input type="number" value={data.amount} onChange={(e) => setData("amount", e.target.value)} />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
              </div>

              {/* DESCRIPTION TEXTAREA FIELD */}
              <div className="md:col-span-2 space-y-2">
                <Label>Invoice Description / Line Items</Label>
                <textarea 
                  value={data.description} 
                  onChange={(e) => setData("description", e.target.value)}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950"
                  placeholder="Enter details about your services or itemized list..."
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              </div>

              {/* BANKING DETAILS PANEL BAR */}
              <div className="md:col-span-2 pt-2 border-t">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wide uppercase">Banking Remittance Details</h3>
              </div>

              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input value={data.bank_name} onChange={(e) => setData("bank_name", e.target.value)} placeholder="e.g. FNB, Standard Bank" />
                {errors.bank_name && <p className="text-red-500 text-sm">{errors.bank_name}</p>}
              </div>

              <div className="space-y-2">
                <Label>Account Type</Label>
                <Select value={data.account_type} onValueChange={(v) => setData("account_type", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking / Current</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
                {errors.account_type && <p className="text-red-500 text-sm">{errors.account_type}</p>}
              </div>

              <div className="space-y-2">
                <Label>Branch Code</Label>
                <Input value={data.branch_code} onChange={(e) => setData("branch_code", e.target.value)} />
                {errors.branch_code && <p className="text-red-500 text-sm">{errors.branch_code}</p>}
              </div>

              <div className="space-y-2">
                <Label>Account Number</Label>
                <Input value={data.account_number} onChange={(e) => setData("account_number", e.target.value)} />
                {errors.account_number && <p className="text-red-500 text-sm">{errors.account_number}</p>}
              </div>

              <div className="md:col-span-2 space-y-2 pt-2 border-t">
                <Label>Logo</Label>
                <Input type="file" onChange={(e) => setData("logo", e.target.files?.[0] ?? null)} />
                {errors.logo && <p className="text-red-500 text-sm">{errors.logo}</p>}
              </div>

              <div className="md:col-span-2 flex justify-end pt-4">
                <Button disabled={processing}>Generate Invoice</Button>
              </div>
            </form>
          )}

          {/* ---------------- REGULAR LIST VIEW ---------------- */}
          {mode === "list" && (
            <table className="w-full text-left border-collapse mt-4">
              <thead>
                <tr className="border-b text-gray-400 text-xs uppercase tracking-wider">
                  <th className="py-3">Client</th>
                  <th>Invoice details</th>
                  <th>Remittance</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((inv: any) => (
                  <tr
                    key={inv.id}
                    onClick={() => openInvoice(inv)}
                    className="border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="py-3 font-medium">
                      <div>{inv.client_name}</div>
                      <div className="text-xs text-gray-400 font-normal">{inv.email}</div>
                    </td>
                    <td>
                      <div className="font-semibold text-gray-700 dark:text-gray-300">#{inv.invoice_number}</div>
                      <div className="text-xs text-gray-400">
                        {inv.invoice_date ? new Date(inv.invoice_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td>
                      <div className="capitalize text-sm font-medium">{inv.bank_name}</div>
                      <div className="text-xs text-gray-400 font-mono">Acc: {inv.account_number}</div>
                    </td>
                    <td className="text-right font-bold text-gray-900 dark:text-white">R {inv.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    {/* ---------------- MODAL SHEET VIEW ---------------- */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4 backdrop-blur-sm">

          <div className="bg-white dark:bg-gray-900 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">

            <div className="flex justify-between items-start p-6 border-b">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Tax Invoice</h2>
                <p className="text-sm text-gray-400">Reference: #{selectedInvoice.invoice_number}</p>
                <p className="text-xs text-gray-400">
                  Date: {selectedInvoice.invoice_date ? new Date(selectedInvoice.invoice_date).toLocaleDateString() : 'N/A'}
                </p>
              </div>

              {selectedInvoice.logo && (
                <img
                  src={`/storage/${selectedInvoice.logo}`}
                  className="h-20 max-w-[200px] object-contain rounded-lg shadow-sm"
                  alt="company business logo"
                />
              )}
            </div>

            <div className="p-6 space-y-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Customer Info</p>
                  <p className="text-base font-bold text-gray-800 dark:text-gray-200 mt-1">{selectedInvoice.client_name}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Balance Due</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">R {selectedInvoice.amount}</p>
                </div>
              </div>

              {/* RENDER DESCRIPTION FIELD WINDOW */}
              {selectedInvoice.description && (
                <div className="space-y-1.5">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Statement / Line Item Breakdowns</p>
                  <div className="bg-gray-50/50 dark:bg-gray-800/30 p-3 rounded-xl border border-dashed text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedInvoice.description}
                  </div>
                </div>
              )}

              {/* RENDER EMAIL BELOW DESCRIPTION */}
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Contact Email</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">
                  {selectedInvoice.email || "No email provided"}
                </p>
              </div>

              {/* RENDER BANKING GRID INFORMATION BLOCK */}
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Electronic Funds Transfer Details</p>
                
                <div className="grid grid-cols-2 gap-y-2 text-gray-600 dark:text-gray-300">
                  <div>
                    <span className="text-gray-400 block text-xs">Bank</span>
                    <strong className="text-gray-800 dark:text-gray-200 capitalize">{selectedInvoice.bank_name || "N/A"}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs">Account Type</span>
                    <strong className="text-gray-800 dark:text-gray-200 capitalize">{selectedInvoice.account_type || "N/A"}</strong>
                  </div>
                  <div className="pt-1">
                    <span className="text-gray-400 block text-xs">Account Number</span>
                    <strong className="text-gray-900 dark:text-white font-mono">{selectedInvoice.account_number || "N/A"}</strong>
                  </div>
                  <div className="pt-1">
                    <span className="text-gray-400 block text-xs">Branch Code</span>
                    <strong className="text-gray-800 dark:text-gray-200 font-mono">{selectedInvoice.branch_code || "N/A"}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900/50 border-t">
              <Button variant="ghost" onClick={closeModal}>Close</Button>
              <Button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700 text-white">Print / Export PDF</Button>
            </div>

          </div>
        </div>
      )}

    </AppLayout>
  );
}