"use client";

import React, { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"




type sales = {

        id: number;
        invoice_number: string;
        user_id: number;
        customer_id: number | null;
        subtotal: number;
        tax: number;
        discount: number;
        total: number;
        amount_received: number;
        change_due: number;
        payment_method: string;
        status: string;
        note: string | null;
        created_at: string; // ISO datetime
        updated_at: string; // ISO datetime
        user?: {
            id: number;
            name: string;
            email: string;
        };

};




export default function Sales({ sales }: { sales: sales[] }) {



    console.log('sales',sales);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Pos", href: "/pos/sales" },
        { title: "Sales", href: "/pos/sales" },
    ];
    

    return(
            <AppLayout breadcrumbs={breadcrumbs}>
              <Head title="POS - Sales" />
              {/* sales table */}
                <div className="p-6 md:p-8 rounded-xl shadow-sm">
                    {/* Mobile scroll wrapper */}
                    <div className="overflow-x-auto w-full">
                        <Table className="min-w-[700px]">
                        <TableCaption>Your recent sales</TableCaption>

                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[140px]">Invoice #</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Sale made by</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                 
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {sales.map((sale) => (
                            <TableRow key={sale.id}>
                            <TableCell className="font-medium">{sale.invoice_number}</TableCell>
                            <TableCell>{sale.status}</TableCell>
                            <TableCell>{sale.payment_method}</TableCell>
                            <TableCell>{sale.user?.name ?? "Unknown"}</TableCell>


                            {/* DATE */}
                            <TableCell>
                                {new Date(sale.created_at).toLocaleString()}
                            </TableCell>

                            {/* TOTAL — right aligned, in correct column */}
                            <TableCell className="text-right">
                                R {Number(sale.total).toFixed(2)}
                            </TableCell>

                
                            </TableRow>
                        ))}
                        </TableBody>

                        <TableFooter>
                        <TableRow>
                            {/* Span first 4 columns */}
                            <TableCell colSpan={5} className="font-semibold">
                            Total Sales
                            </TableCell>

                            {/* Total — aligned under Total column */}
                            <TableCell className="text-right font-semibold">
                            R {sales.reduce((sum, s) => sum + Number(s.total), 0).toFixed(2)}
                            </TableCell>

                            {/* Empty Date column */}
                            <TableCell></TableCell>
                        </TableRow>
                        </TableFooter>
                        </Table>
                    </div>
                </div>
            </AppLayout>
    )

}