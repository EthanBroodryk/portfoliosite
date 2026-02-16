"use client";

import { useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Suppliers() {
  const { errors } = usePage().props;

  const { data, setData, post, processing } = useForm({
    name: "",
    contact_name: "",
    email: "",
    phone: "",
    website: "",
    address_line1: "",
    address_line2: "",
    city: "",
    province: "",
    postal_code: "",
    country: "",
    vat_number: "",
    account_number: "",
    payment_terms: "",
    is_active: true,
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Suppliers", href: "/suppliers" },
    { title: "Manage Suppliers", href: "/suppliers" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/suppliers");
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Suppliers" />

      <Card className="w-full max-w-3xl mx-auto mt-6">
        <CardHeader>
          <CardTitle>Create Supplier</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Supplier Name *</Label>
                <Input
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Enter supplier name"
                  className="mt-1"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label>Contact Person</Label>
                <Input
                  value={data.contact_name}
                  onChange={(e) => setData("contact_name", e.target.value)}
                  placeholder="Enter contact person"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="Enter email"
                  className="mt-1"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={data.phone}
                  onChange={(e) => setData("phone", e.target.value)}
                  placeholder="Enter phone"
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label>Website</Label>
                <Input
                  value={data.website}
                  onChange={(e) => setData("website", e.target.value)}
                  placeholder="Enter website"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Address Line 1</Label>
                <Input
                  value={data.address_line1}
                  onChange={(e) => setData("address_line1", e.target.value)}
                  placeholder="Street address"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Address Line 2</Label>
                <Input
                  value={data.address_line2}
                  onChange={(e) => setData("address_line2", e.target.value)}
                  placeholder="Apartment, suite, etc."
                  className="mt-1"
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  value={data.city}
                  onChange={(e) => setData("city", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Province</Label>
                <Input
                  value={data.province}
                  onChange={(e) => setData("province", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Postal Code</Label>
                <Input
                  value={data.postal_code}
                  onChange={(e) => setData("postal_code", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Country</Label>
                <Input
                  value={data.country}
                  onChange={(e) => setData("country", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Accounting */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>VAT Number</Label>
                <Input
                  value={data.vat_number}
                  onChange={(e) => setData("vat_number", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Account Number</Label>
                <Input
                  value={data.account_number}
                  onChange={(e) => setData("account_number", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Payment Terms</Label>
                <Input
                  value={data.payment_terms}
                  onChange={(e) => setData("payment_terms", e.target.value)}
                  placeholder="e.g., NET30"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Active Supplier */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.is_active}
                onChange={(e) => setData("is_active", e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800"
              />
              <span className="font-medium">Active Supplier</span>
            </div>

            {/* Submit */}
            <div>
              <Button type="submit" className="w-full md:w-auto" disabled={processing}>
                {processing ? "Saving..." : "Save Supplier"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
