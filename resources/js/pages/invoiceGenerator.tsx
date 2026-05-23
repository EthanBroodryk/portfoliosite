"use client";

import { useState, FormEvent } from "react";
import { useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

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

  const { data, setData, post, processing, errors, reset } = useForm({
    client_name: "",
    email: "",
    invoice_number: "",
    amount: "",
    status: "pending",
    logo: null as File | null,
  });

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post("/invoices", {
      forceFormData: true,
      onSuccess: () => reset(),
    });
  };

  const openInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
  };

  const closeModal = () => {
    setSelectedInvoice(null);
  };

  const printInvoice = () => {
    window.print();
  };
console.log(selectedInvoice);
 // console.log(invoices);

  

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Generate Invoice" />

      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 space-y-6">
          <h1 className="text-2xl font-bold">Create Invoice</h1>

          {/* ---------------------- FORM ----------------------------------- */}
          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Client Name */}
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                value={data.client_name}
                onChange={(e) => setData("client_name", e.target.value)}
                placeholder="John Doe"
              />
              {errors.client_name && <p className="text-red-500 text-sm">{errors.client_name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Invoice Number */}
            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input
                value={data.invoice_number}
                onChange={(e) => setData("invoice_number", e.target.value)}
                placeholder="INV-001"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                value={data.amount}
                onChange={(e) => setData("amount", e.target.value)}
                placeholder="1000"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={data.status} onValueChange={(value) => setData("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Logo (optional)</Label>
              <Input
                type="file"
                onChange={(e) => setData("logo", e.target.files?.[0] ?? null)}
              />
            </div>

            {/* Submit Button (full width) */}
            <div className="md:col-span-2 flex justify-end pt-4">
              <Button disabled={processing}>Create Invoice</Button>
            </div>
          </form>

          {/* ---------------------- INVOICE LIST --------------------------- */}
          <h2 className="text-xl font-semibold mt-10 mb-3">All Invoices</h2>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Client</th>
                <th className="py-2">Email</th>
                <th className="py-2">Invoice #</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((inv: any) => (
                <tr
                  key={inv.id}
                  className="border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => openInvoice(inv)}
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
        </div>
      </div>

      {/* ---------------------- MODAL ---------------------------------- */}
        {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999] p-4">
            
            {/* Paper Invoice Container */}
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b dark:border-gray-700">
                
                <div>
                <h2 className="text-2xl font-bold tracking-wide">INVOICE</h2>
                <p className="text-sm text-gray-500">
                    #{selectedInvoice.invoice_number}
                </p>
                </div>

                {selectedInvoice.logo && (
                <img
                    src={`/storage/${selectedInvoice.logo}`}
                    alt="Logo"
                    className="h-14 w-14 object-contain"
                />
                )}
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">

                {/* Client Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                
                <div>
                    <p className="text-gray-500">Billed To</p>
                    <p className="font-semibold">{selectedInvoice.client_name}</p>
                    <p>{selectedInvoice.email}</p>
                </div>

                <div className="text-right">
                    <p className="text-gray-500">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                    ${selectedInvoice.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                    >
                    {selectedInvoice.status}
                    </span>
                </div>
                </div>

                {/* Invoice Table */}
                <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                <div className="grid grid-cols-2 bg-gray-100 dark:bg-gray-800 text-sm font-semibold p-3">
                    <span>Description</span>
                    <span className="text-right">Amount</span>
                </div>

                <div className="grid grid-cols-2 p-3 text-sm">
                    <span>Service / Product</span>
                    <span className="text-right">R {selectedInvoice.amount}</span>
                </div>
                </div>

                {/* Total */}
                <div className="flex justify-end">
                <div className="text-right space-y-1">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-xl font-bold">
                    R {selectedInvoice.amount}
                    </p>
                </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                
                <Button variant="secondary" onClick={closeModal}>
                Close
                </Button>

                <Button onClick={printInvoice}>
                Print / Download PDF
                </Button>
            </div>

            </div>
        </div>
        )}
    </AppLayout>
  );
}