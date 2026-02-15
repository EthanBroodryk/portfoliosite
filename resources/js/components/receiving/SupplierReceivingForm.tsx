"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SupplierReceivingFormProps {
  onSubmit?: (data: any) => void;
}

export default function SupplierReceivingForm({ onSubmit }: SupplierReceivingFormProps) {
  const [supplierName, setSupplierName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [receivedAt, setReceivedAt] = useState("");

  const handleSubmit = () => {
    const formData = { supplierName, invoiceNumber, notes, receivedAt };
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log("Submit Supplier Receiving:", formData);
    }
  };

  return (
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

      <Button className="mt-4" onClick={handleSubmit}>
        Submit Supplier Receiving
      </Button>
    </div>
  );
}
