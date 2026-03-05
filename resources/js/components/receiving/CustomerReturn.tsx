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
  sku: string;
  id: number;
  name: string;
  quantity: number;
}

interface BranchReturnReceivingProps {
  branches: { id: number; name: string }[];
  selectedTypeId: number | null;
  selectedBranchId: number | null;
  suppliers: { id: number; name: string }[];
  onSubmit?: (data: any) => void;
}

export default function CustomrerReturn({
  branches,
  selectedTypeId,
  selectedBranchId,
  suppliers,
  onSubmit,
}: BranchReturnReceivingProps) {
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [branchId, setBranchId] = useState<number | null>(selectedBranchId);

  const [errors, setErrors] = useState<any>({});

  // Customer return fields
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [returnCondition, setReturnCondition] = useState("");
  const [refundMethod, setRefundMethod] = useState("");
  const [saleReference, setSaleReference] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [receivedAt, setReceivedAt] = useState("");
  const [typeScan, settypeScan] = useState(true);
  const [typedBarcode, settypedBarcode] = useState("");

  //search customer
  const [customerResults, setCustomerResults] = useState<any[]>([]);
  const [showCustomerResults, setShowCustomerResults] = useState(false);

  const fetchProduct = async (barcode: string) => {
    try {
      const res = await axios.get(`/products/find-by-barcode/${barcode}`);
      if (res) {
        setProduct(res.data);
        setScannerEnabled(false);
        setQuantity(1);
      }
    } catch (err) {}
  };

  const searchCustomers = async (query: string) => {
  if (query.length < 2) {
    setCustomerResults([]);
    return;
  }

  try {
    const res = await axios.get(`/customer/search?query=${query}`);
    setCustomerResults(res.data);
    setShowCustomerResults(true);
  } catch (err) {
    console.error(err);
  }
};

  const handleSubmit = async () => {
    if (!product) {
      alert("Please scan or select a product first");
      return;
    }

    const payload = {
      branch_id: branchId,
      receiving_type_id: selectedTypeId,
      product_id: product.id,
      quantity,
      customer_name: customerName,
      customer_contact: customerContact,
      return_reason: returnReason,
      return_condition: returnCondition,
      refund_method: refundMethod,
      sale_reference: saleReference,
      invoice_number: invoiceNumber,
      notes,
      received_at: receivedAt,
    };

    try {
      setErrors({});
      await axios.post("/stock/receiving/store", payload);
      onSubmit?.(payload);
      alert("Customer return saved!");
      resetForm();
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        alert("Unexpected error occurred");
      }
    }
  };

  const handleScan = (result: any) => {
    if (result?.getText()) {
      const code = result.getText();
      setScannedCode(code);
      fetchProduct(code);
    }
  };

  const resetForm = () => {
  setScannerEnabled(false);
  setScannedCode(null);
  setProduct(null);
  setQuantity(1);
  setBranchId(selectedBranchId ?? null);

  // Customer return fields
  setCustomerName("");
  setCustomerContact("");
  setReturnReason("");
  setReturnCondition("");
  setRefundMethod("");
  setSaleReference("");

  setInvoiceNumber("");
  setNotes("");
  setReceivedAt("");

  // Scanning modes
  settypeScan(true);
  settypedBarcode("");

  setErrors({});
};

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Customer Return</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* SELECT BRANCH */}
        <div>
        <Label>Select Branch *</Label>
        <Select
            value={branchId?.toString() || ""}
            onValueChange={(val) => setBranchId(Number(val))}
        >
            <SelectTrigger>
            <SelectValue placeholder="Select branch" />
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
        {/* CUSTOMER NAME */}
        <div className="relative">
          <Label>Customer Name</Label>
          <Input
            value={customerName}
            onChange={(e) => {
              const value = e.target.value;
              setCustomerName(value);
              searchCustomers(value);
            }}
            placeholder="Enter customer name"
          />

          <Input
          value={customerContact}
          onChange={(e) => {
            const value = e.target.value;
            setCustomerContact(value);
            searchCustomers(value);
          }}
          placeholder="Phone number"
        />
        {showCustomerResults && customerResults.length > 0 && (
          <div className="absolute w-full z-10 border rounded-md bg-background text-foreground shadow-md">
            {customerResults.map((c) => (
              <div
                key={c.id}
                className="p-2 cursor-pointer hover:bg-muted"
                onClick={() => {
                  setCustomerName(c.name);
                  setCustomerContact(c.phone);
                  setShowCustomerResults(false);
                }}
              >
                {c.name} — {c.phone}
              </div>
            ))}
          </div>
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

        {/* RETURN REASON */}
        <div>
          <Label>Reason for Return</Label>
          <textarea
            className="w-full p-2 border rounded bg-background text-foreground"
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            placeholder="e.g. Damaged item, wrong size, customer changed mind"
          />
        </div>

        {/* RETURN CONDITION */}
        <div>
          <Label>Condition</Label>
          <Select
            value={returnCondition}
            onValueChange={(val) => setReturnCondition(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="resellable">Resellable</SelectItem>
              <SelectItem value="damaged">Damaged (Write-off)</SelectItem>
              <SelectItem value="repair">Repair Required</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* REFUND METHOD */}
        <div>
          <Label>Refund Method</Label>
          <Select
            value={refundMethod}
            onValueChange={(val) => setRefundMethod(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select refund method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card Refund</SelectItem>
              <SelectItem value="store_credit">Store Credit</SelectItem>
              <SelectItem value="exchange">Exchange Item</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ORIGINAL SALE REF */}
        <div>
          <Label>Original Sale Reference</Label>
          <Input
            value={saleReference}
            onChange={(e) => setSaleReference(e.target.value)}
            placeholder="Invoice or order number"
          />
        </div>

        {/* RECEIVED DATE */}
        <div>
          <Label>Returned At</Label>
          <Input
            type="date"
            value={receivedAt}
            onChange={(e) => setReceivedAt(e.target.value)}
          />
        </div>

        {/* SCAN OR TYPE TOGGLE */}
        <div className="flex gap-2">
          {!typeScan && (
            <Button
              variant="secondary"
              onClick={() => {
                settypeScan(true);
                setScannerEnabled(false);
              }}
            >
              Scan Barcode Instead
            </Button>
          )}

          {typeScan && (
            <Button
              onClick={() => {
                settypeScan(false);
                setScannerEnabled(false);
              }}
            >
              Type Barcode Instead
            </Button>
          )}
        </div>

        {/* TYPE BARCODE */}
        {!typeScan && (
          <div>
            <Label>Type Barcode</Label>
            <Input
              value={typedBarcode}
              onChange={(e) => settypedBarcode(e.target.value)}
            />

            <Button
              className="mt-2"
              onClick={() => {
                if (typedBarcode.trim() !== "") {
                  fetchProduct(typedBarcode);
                }
              }}
            >
              Search Product
            </Button>
          </div>
        )}

        {/* SCAN BARCODE MODE */}
        {typeScan && (
          <div>
            <Button onClick={() => setScannerEnabled(!scannerEnabled)}>
              {scannerEnabled ? "Stop Scanner" : "Scan Barcode"}
            </Button>

            {scannerEnabled && (
              <BarcodeScannerComponent
                height={300}
                width={400}
                onUpdate={(err, result) => {
                  if (result && result.getText()) {
                    handleScan(result);
                  }
                }}
              />
            )}
          </div>
        )}

        {/* SHOW PRODUCT */}
        {product && (
          <Card className="border p-4 rounded space-y-2 bg-muted">
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
          </Card>
        )}

        {/* SUBMIT */}
        <Button onClick={handleSubmit}>Submit</Button>
      </CardContent>
    </Card>
  );
}