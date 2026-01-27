"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SaleDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  sale: any | null;
  items: any[];
}

export default function SaleDetailsDialog({
  open,
  onClose,
  sale,
  items,
}: SaleDetailsDialogProps) {
  if (!sale) return null;

  // Helper to safely convert values to numbers
  const formatCurrency = (value: any) => {
    const num = Number(value);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Sale Details</DialogTitle>
          <DialogDescription>
            Invoice #{sale.invoice_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Sale Summary */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p>
              <strong>Cashier:</strong> {sale.user?.name ?? "Unknown"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(sale.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Payment:</strong> {sale.payment_method}
            </p>
            <p>
              <strong>Status:</strong> {sale.status}
            </p>
          </div>

          {/* Items Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.product?.name ?? `Product #${item.product_id}`}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>R {formatCurrency(item.unit_price)}</TableCell>
                  <TableCell className="text-right">
                    R {formatCurrency(item.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Totals */}
          <div className="flex justify-end text-right mt-4">
            <div className="space-y-1">
              <p>
                <strong>Subtotal:</strong> R {formatCurrency(sale.subtotal)}
              </p>
              <p>
                <strong>Tax:</strong> R {formatCurrency(sale.tax)}
              </p>
              <p>
                <strong>Discount:</strong> R {formatCurrency(sale.discount)}
              </p>
              <p className="font-semibold text-lg">
                Total: R {formatCurrency(sale.total)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
