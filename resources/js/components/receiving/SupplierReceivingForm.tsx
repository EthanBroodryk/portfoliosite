"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  sku: string;
  quantity: number;
}

interface SupplierReceivingFormProps {
  onSubmit?: (data: any) => void;
}

export default function SupplierReceivingForm({ onSubmit }: SupplierReceivingFormProps) {
  const [supplierName, setSupplierName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [receivedAt, setReceivedAt] = useState("");
  const [scannerEnabled, setScannerEnabled] = useState(false);

  const [scannedCode, setScannedCode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  // -------------------------
  // Fetch product by barcode
  // -------------------------
  const fetchProduct = async (barcode: string) => {
    try {
      const response = await axios.get(`/products/find-by-barcode/${barcode}`);
      if (response.data) {
        setProduct(response.data);
        setQuantity(1); // reset quantity
        console.log("Product fetched:", response.data);
      } else {
        alert("Product not found!");
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Product not found!");
      setProduct(null);
    }
  };

  // -------------------------
  // Handle barcode scan result
  // -------------------------
  const handleScan = (result: any) => {
    if (result?.getText) {
      const code = result.getText();
      console.log("Scanned barcode:", code);
      setScannedCode(code);
      fetchProduct(code);
      setScannerEnabled(false); // optional: close scanner after scan
    }
  };

  // -------------------------
  // Adjust quantity
  // -------------------------
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // -------------------------
  // Submit form
  // -------------------------
  const handleSubmit = () => {
    if (!product) {
      alert("Please scan and select a product first.");
      return;
    }

    const formData = {
      supplierName,
      invoiceNumber,
      notes,
      receivedAt,
      productId: product.id,
      productName: product.name,
      quantity,
    };

    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log("Submit Supplier Receiving:", formData);
    }

    // Reset
    setProduct(null);
    setScannedCode("");
    setQuantity(1);
  };

  return (
    <div className="mt-6 border-t pt-6 space-y-4">
      <h2 className="text-lg font-semibold">Supplier Receiving Form</h2>

      {/* Supplier info */}
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

      {/* Barcode scanner */}
      <div className="mt-4">
        <Button onClick={() => setScannerEnabled(!scannerEnabled)}>
          {scannerEnabled ? "Stop Scanner" : "Scan Product Barcode"}
        </Button>

        {scannerEnabled && (
          <div className="mt-2 w-full h-80 border">
            <BarcodeScannerComponent
              width={400}
              height={300}
              onUpdate={(error, result) => {
                if (result) handleScan(result);
                if (error) console.error("Scanner error:", error);
              }}
            />
          </div>
        )}
      </div>

      {/* Product info + quantity adjustment */}
      {product && (
        <div className="mt-4 border p-4 rounded space-y-2">
          <h3 className="font-semibold">{product.name}</h3>
          <p>SKU: {product.sku}</p>
          <p>Current Quantity: {product.quantity}</p>

          <div className="flex items-center gap-2 mt-2">
            <Button onClick={decrementQuantity}>-</Button>
            <span>{quantity}</span>
            <Button onClick={incrementQuantity}>+</Button>
          </div>
        </div>
      )}

      <Button className="mt-4" onClick={handleSubmit}>
        Submit Supplier Receiving
      </Button>
    </div>
  );
}
