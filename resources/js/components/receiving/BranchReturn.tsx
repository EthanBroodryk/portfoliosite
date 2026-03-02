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
     
    sku:string,
    id:number,
    name:string,
    quantity:number

}

interface BranchReturnReceivingProps{

    branches:{id:number,name:string}[];
    selectedTypeId:number | null;
    selectedBranchId: number | null;
    suppliers: { id: number; name: string }[];
    onSubmit?: (data: any) => void;
    
}





export default function BranchReturn({branches,selectedTypeId, selectedBranchId,  suppliers, onSubmit}:BranchReturnReceivingProps)
{


    const [scannerEnabled, setScannerEnabled] = useState(false);
    const [scannedCode,setScannedCode] = useState<string | null>(null);
    const [product,setProduct] = useState<Product | null>(null);
    const [quantity,setQuantity] = useState(1);
    const [branchId, setBranchId] = useState<number | null>(selectedBranchId);

    const [errors, setErrors] = useState<any>({});
    const [supplierId, setSupplierId] = useState<number | null>(null);
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [receivedAt, setReceivedAt] = useState("");
    const [typeScan,settypeScan] = useState(true);
    const [typedBarcode,settypedBarcode] = useState("")
    const [toBranch,setToBranch] = useState("");
    const [fromBranch, setFromBranch] = useState("");
    


    const fetchProduct = async (barcode:string) =>{
        try{
             let res = await axios.get(`/products/find-by-barcode/${barcode}`);
             if(res){
                setProduct(res.data);
                setScannerEnabled(false);
                setQuantity(1);
             }
         
        }catch(err){

        }

    }

  const handleSubmit = async () => {
    if (!product) {
      alert("Please scan or select a product first");
      return;
    }
    // if (!supplierId) {
    //   alert("Please select a supplier");
    //   return;
    // }
    // if (!branchId) {
    //   alert("Please select a branch");
    //   return;
    // }

    const payload = {
      fromBranch:getFromBranchId(fromBranch),
      toBranch:getFromBranchId(toBranch),
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
      setToBranch("");
      setFromBranch("");

      alert("Receiving saved!");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        alert("Unexpected error occurred");
      }
    }
  };

    const handleScan = (result:any)=>{
        if(result?.getText()){
             const code = result.getText();
             setScannedCode(code);
             fetchProduct(code);
        }

    }


    const getFromBranchId = (name?:string) => {
      let fromBranch =   branches.find(b => b.name == name)
      return fromBranch ? fromBranch.id : null
    }

    return(
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Branch Return</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="flex flex-col space-y-1">
                    <Label>From Branch</Label>
                    <Select value={fromBranch} onValueChange={(val)=>(setFromBranch(val))}>
                        <SelectTrigger>
                            <SelectValue placeholder="From Branch:"/>
                        </SelectTrigger>
                        <SelectContent>
                            {branches.map((branch)=>(
                                <SelectItem  value={branch.name} key={branch.id}>{branch.name}</SelectItem>
                              ))}
                        </SelectContent>
                    </Select>
                    </div>

                    <div className="flex flex-col space-x-1">
                    <Label>To Branch</Label>
                    <Select value={toBranch} onValueChange={(val)=>setToBranch(val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="To:"/>
                        </SelectTrigger>
                        <SelectContent>
                            {branches.filter((b)=>(b.name !== fromBranch)).map((b)=>(<SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>))}
                        </SelectContent>
                    </Select>
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

                {/* SCAN OR TYPE TOGGLE */}
                <div className="flex gap-2">
                    {/* Switch to manual typing */}
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

                    {/* Switch to scan mode */}
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

                {/* Manual Barcode Input */}
                {!typeScan && (
                <div className="mt-2">
                    <Label>Type Barcode</Label>
                    <Input
                    value={typedBarcode}
                    onChange={(e) => settypedBarcode(e.target.value)}
                    placeholder="Enter barcode manually"
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

                {/* Barcode scanned */}
                {/* Scan Barcode Mode */}
                {typeScan && (
                <div className="mt-2">
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

                {/* show product */}
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
                    {/* handel submit */}
                    <Button onClick={handleSubmit}>submit</Button>
            </CardContent>
        </Card>
    );
}