"use client";

import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function AddStock() {
    const { branches } = usePage().props as unknown as {
        branches: any[];
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Stock", href: "/stock" },
        { title: "Add Stock", href: "/stock/create" },
    ];

    const [scannerEnabled, setScannerEnabled] = useState(false);

    const [form, setForm] = useState({
        product_id: "",
        branch_id: "",
        quantity: 1,
        barcode: "",
    });

    // 🔍 Fetch product by barcode
    const lookupProduct = async (barcode: string) => {
        try {
            const res = await fetch(`/products/find-by-barcode/${barcode}`);
            const data = await res.json();

            if (data.found) {
                setForm((prev) => ({
                    ...prev,
                    product_id: data.product.id.toString(),
                    barcode: "",
                }));
            } else {
                alert("Product not found in database.");
            }
        } catch (error) {
            alert("Error scanning product.");
        }
    };

    // 📸 When scanner reads barcode
    const handleScan = (value: string) => {
        if (!value) return;

        setScannerEnabled(false);
        lookupProduct(value);
    };

    // ⌨️ Enter key in input
    const handleBarcodeEnter = (code: string) => {
        if (!code) return;
        lookupProduct(code);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post("/stock", form);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Stock" />

            <div className="p-6 md:p-8 rounded-xl shadow-sm max-w-2xl">
                <h1 className="text-2xl font-semibold mb-6">Add Stock</h1>

                {/* BARCODE SCANNER */}
                {scannerEnabled && (
                    <div className="mb-4 border rounded p-2">
                        <BarcodeScannerComponent
                            width={300}
                            height={250}
                            onUpdate={(err, result) => {
                                if (result) handleScan(result.getText());
                            }}
                        />
                        <Button
                            variant="destructive"
                            className="w-full mt-2"
                            onClick={() => setScannerEnabled(false)}
                        >
                            Stop Scanner
                        </Button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Barcode Input */}
                    <div>
                        <Label>Scan Barcode</Label>
                        <div className="flex space-x-2 mt-1">
                            <Input
                                value={form.barcode}
                                placeholder="Scan product barcode..."
                                onChange={(e) =>
                                    setForm({ ...form, barcode: e.target.value })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleBarcodeEnter(form.barcode);
                                    }
                                }}
                            />

                            <Button type="button" onClick={() => setScannerEnabled(true)}>
                                Scan
                            </Button>
                        </div>
                    </div>

                    {/* Product Select is OPTIONAL since scanner will auto-select */}
                    <div>
                        <Label>Selected Product</Label>
                        <Input
                            value={form.product_id}
                            disabled
                            placeholder="Product auto-filled after scanning"
                            className="mt-1"
                        />
                    </div>

                    {/* Branch Select */}
                    <div>
                        <Label>Branch</Label>
                        <Select
                            value={form.branch_id}
                            onValueChange={(value) =>
                                setForm({ ...form, branch_id: value })
                            }
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select a branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches.map((b) => (
                                    <SelectItem key={b.id} value={b.id.toString()}>
                                        {b.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Quantity */}
                    <div>
                        <Label>Quantity</Label>
                        <Input
                            type="number"
                            min={1}
                            value={form.quantity}
                            onChange={(e) =>
                                setForm({ ...form, quantity: Number(e.target.value) })
                            }
                            className="mt-1"
                        />
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="w-full">
                        Add Stock
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
