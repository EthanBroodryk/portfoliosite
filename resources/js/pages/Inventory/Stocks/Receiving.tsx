"use client";

import { useState } from "react";
import { usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import SupplierReceivingForm from "@/components/receiving/SupplierReceivingForm";
import ReceivingFilters from "@/components/receiving/ReceivingFilters";


type ReceivingPageProps = {
  receiving_types: Array<{ id: number; name: string; label: string }>;
  branches: Array<{ id: number; name: string }>;
  users: Array<{ id: number; name: string }>;
};

export default function Receiving() {


  const { receiving_types, branches, users } = usePage<ReceivingPageProps>().props;

  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Stock", href: "/stocks/receiving" },
    { title: "Receiving", href: "/stocks/receiving" },
  ];

  // Find the selected receiving type object
  const selectedTypeObj = receiving_types.find(
    (t) => t.id === selectedTypeId
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Receiving" />

      <div className="p-6 md:p-8 rounded-xl shadow-sm bg-card text-card-foreground">

        {/* FILTERS */}
        <ReceivingFilters
          receiving_types={receiving_types}
          branches={branches}
          users={users}
          selectedTypeId={selectedTypeId}
          setSelectedTypeId={setSelectedTypeId}
        />

        {/* Render Supplier Receiving Form if selected */}
        {selectedTypeObj?.name === "SUPPLIER" && (
          <SupplierReceivingForm
            branches={branches}
            receiving_types={receiving_types}
            selectedTypeId={selectedTypeId}
            selectedBranchId={null} // temporary
            onSubmit={(data) => console.log("Form Data:", data)}
          />
        )}

      </div>
    </AppLayout>
  );
}
