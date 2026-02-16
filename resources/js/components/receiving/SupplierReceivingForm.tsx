"use client";

import { useState } from "react";
import axios from "axios";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
}

interface SupplierReceivingFormProps {
  branches: any[];
  receiving_types: any[];
  selectedTypeId: number | null;
  selectedBranchId: number | null;
  onSubmit?: (data: any) => void;
}

export default function SupplierReceivingForm({
  branches,
  receiving_types,
  selectedTypeId,
  selectedBranchId,
  onSubmit,
}: SupplierReceivingFormProps) {
  const [supplierName, setSupplierName] = useState("");
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
  // Submit form to backend
  // -------------------------
  const handleSubmit = async () => {
    if (!product) {
      alert("Please scan a product first");
      return;
    }

    const payload = {
      supplier_name: supplierName,
      invoice_number: invoiceNumber,
      notes: notes,
      received_at: receivedAt,
      product_id: product.id,
      quantity: quantity,
      branch_id: selectedBranchId,
      receiving_type_id: selectedTypeId,
    };

    try {
      setErrors({});
      const res = await axios.post("/stock/receiving/store", payload);

      if (onSubmit) {
        onSubmit(payload);
      }

      alert("Receiving saved!");

      // Reset form
      setSupplierName("");
      setInvoiceNumber("");
      setNotes("");
      setReceivedAt("");
      setProduct(null);
      setScannedCode("");
      setQuantity(1);

    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        alert("Unexpected error occurred");
      }
    }
  };

  return (
    <div className="mt-6 border-t pt-6 space-y-4">
      <h2 className="text-lg font-semibold">Supplier Receiving</h2>

      {/* Supplier Name */}
      <div>
        <Label>Supplier Name</Label>
        <Input
          value={supplierName}
          onChange={(e) => setSupplierName(e.target.value)}
        />
        {errors.supplier_name && (
          <p className="text-red-500 text-sm">{errors.supplier_name[0]}</p>
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
          className="w-full p-2 border rounded"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Date */}
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
      <div className="mt-4">
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
        <div className="mt-4 border p-4 rounded space-y-2">
          <h3 className="font-semibold">{product.name}</h3>
          <p>SKU: {product.sku}</p>
          <p>Current Stock: {product.quantity}</p>

          <div className="flex items-center gap-2 mt-2">
            <Button onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}>
              -
            </Button>
            <span>{quantity}</span>
            <Button onClick={() => setQuantity((q) => q + 1)}>+</Button>
          </div>
        </div>
      )}

      <Button className="mt-4" onClick={handleSubmit}>
        Save Receiving
      </Button>
    </div>
  );
}
