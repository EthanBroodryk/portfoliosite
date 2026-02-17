"use client";

import { useState } from "react";
import axios from "axios";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
}

interface SupplierReceivingFormProps {
  branches: { id: number; name: string }[];
  receiving_types: { id: number; name: string; label: string }[];
  suppliers: { id: number; name: string }[];
  selectedTypeId: number | null;
  selectedBranchId: number | null;
  onSubmit?: (data: any) => void;
}

export default function SupplierReceivingForm({
  branches,
  receiving_types,
  suppliers,
  selectedTypeId,
  selectedBranchId,
  onSubmit,
}: SupplierReceivingFormProps) {
  // -------------------------
  // React state
  // -------------------------
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [branchId, setBranchId] = useState<number | null>(selectedBranchId);

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [receivedAt, setReceivedAt] = useState("");
  const [scannerEnabled, setScannerEnabled] = useState(false);

  const [scannedCode, setScannedCode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [errors, setErrors] = useState<any>({});

  // -------------------------
  // Fetch product by barcode
  // -------------------------
  const fetchProduct = async (barcode: string) => {
    try {
      const res = await axios.get(`/products/find-by-barcode/${barcode}`);
      if (res.data) {
        setProduct(res.data);
        setQuantity(1);
      }
    } catch {
      alert("Product not found");
      setProduct(null);
    }
  };

  // -------------------------
  // Handle scan
  // -------------------------
  const handleScan = (result: any) => {
    if (result?.getText) {
      const code = result.getText();
      setScannedCode(code);
      fetchProduct(code);
      setScannerEnabled(false);
    }
  };

  // -------------------------
  // Submit form
  // -------------------------
  const handleSubmit = async () => {
    if (!product) {
      alert("Please scan or select a product first");
      return;
    }
    if (!supplierId) {
      alert("Please select a supplier");
      return;
    }
    if (!branchId) {
      alert("Please select a branch");
      return;
    }

    const payload = {
      supplier_id: supplierId,
      invoice_number: invoiceNumber,
      notes,
      received_at: receivedAt,
      product_id: product.id,
      quantity,
      branch_id: branchId, // <-- Correct branch
      receiving_type_id: selectedTypeId,
    };

    try {
      setErrors({});
      await axios.post("/stock/receiving/store", payload);
      onSubmit?.(payload);

      // Reset form
      setSupplierId(null);
      setBranchId(selectedBranchId ?? null);
      setInvoiceNumber("");
      setNotes("");
      setReceivedAt("");
      setProduct(null);
      setScannedCode("");
      setQuantity(1);

      alert("Receiving saved!");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        alert("Unexpected error occurred");
      }
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Supplier Receiving</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Branch */}
        <div>
          <Label>Branch *</Label>
          <Select
            value={branchId !== null ? branchId.toString() : ""}
            onValueChange={(val) => setBranchId(Number(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>

            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id.toString()}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.branch_id && (
            <p className="text-red-500 text-sm">{errors.branch_id[0]}</p>
          )}
        </div>

        {/* Supplier */}
        <div>
          <Label>Supplier *</Label>
          <Select
            value={supplierId !== null ? supplierId.toString() : ""}
            onValueChange={(val) => setSupplierId(Number(val))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.supplier_id && (
            <p className="text-red-500 text-sm">{errors.supplier_id[0]}</p>
          )}
        </div>

        {/* Invoice Number */}
        <div>
          <Label>Invoice Number</Label>
          <Input
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
          {errors.invoice_number && (
            <p className="text-red-500 text-sm">{errors.invoice_number[0]}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <Label>Notes</Label>
          <textarea
            className="w-full p-2 border rounded bg-background text-foreground"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Received Date */}
        <div>
          <Label>Received At</Label>
          <Input
            type="date"
            value={receivedAt}
            onChange={(e) => setReceivedAt(e.target.value)}
          />
          {errors.received_at && (
            <p className="text-red-500 text-sm">{errors.received_at[0]}</p>
          )}
        </div>

        {/* Barcode Scanner */}
        <div>
          <Button onClick={() => setScannerEnabled(!scannerEnabled)}>
            {scannerEnabled ? "Stop Scanner" : "Scan Product Barcode"}
          </Button>
          {scannerEnabled && (
            <div className="mt-2 w-full h-80 border">
              <BarcodeScannerComponent
                width={400}
                height={300}
                onUpdate={(err, result) => {
                  if (result) handleScan(result);
                }}
              />
            </div>
          )}
        </div>

        {/* Product Info */}
        {product && (
          <Card className="border p-4 rounded space-y-2 bg-muted">
            <h3 className="font-semibold">{product.name}</h3>
            <p>SKU: {product.sku}</p>
            <p>Current Stock: {product.quantity}</p>
            <div className="flex items-center gap-2 mt-2">
              <Button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>-</Button>
              <span>{quantity}</span>
              <Button onClick={() => setQuantity((q) => q + 1)}>+</Button>
            </div>
          </Card>
        )}

        {/* Submit */}
        <Button className="w-full md:w-auto" onClick={handleSubmit}>
          Save Receiving
        </Button>
      </CardContent>
    </Card>
  );
}
