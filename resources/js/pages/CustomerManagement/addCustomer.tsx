"use client";

import { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AddCustomer() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Customers", href: "/customer/add" },
    { title: "Add Customer", href: "/customer/add" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post("/customer/store", formData, {
      onSuccess: () => {
        setFormData({ name: "", email: "", phone: "" });
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Customer" />
      <div className="p-6 md:p-8 rounded-xl shadow-sm bg-card text-card-foreground">
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Add Customer</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter customer name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="customer@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="text"
                placeholder="e.g. 071 234 5678"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 text-white">
                Add Customer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </AppLayout>
  );
}