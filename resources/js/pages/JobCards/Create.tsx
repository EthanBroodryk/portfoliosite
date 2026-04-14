"use client";

import { FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function CreateJobCard() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Job Cards", href: "/job-cards" },
    { title: "Create Job Card", href: "/job-cards/create" },
  ];

  const { data, setData, post, processing, errors } = useForm({
    date: "",
    technician: "",
    customer_order_no: "",
    to: "",
    call_out_time: "",
    start_time: "",
    end_time: "",
    email: "",
    tel: "",
    description: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post("/job-cards");
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Job Card" />

      <div className="flex justify-center py-10">
        <div className="w-full max-w-xl p-6 border rounded-md shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Create Job Card</h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Date */}
            <div className="space-y-1">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={data.date}
                onChange={(e) => setData("date", e.target.value)}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>

            {/* Technician */}
            <div className="space-y-1">
              <Label htmlFor="technician">Technician</Label>
              <Input
                id="technician"
                placeholder="Technician name"
                value={data.technician}
                onChange={(e) => setData("technician", e.target.value)}
              />
              {errors.technician && (
                <p className="text-red-500 text-sm">{errors.technician}</p>
              )}
            </div>

            {/* Customer Order No */}
            <div className="space-y-1">
              <Label htmlFor="customer_order_no">Customer O/No</Label>
              <Input
                id="customer_order_no"
                placeholder="Customer order number"
                value={data.customer_order_no}
                onChange={(e) => setData("customer_order_no", e.target.value)}
              />
              {errors.customer_order_no && (
                <p className="text-red-500 text-sm">
                  {errors.customer_order_no}
                </p>
              )}
            </div>

            {/* To: */}
            <div className="space-y-1">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                placeholder="Customer / Company"
                value={data.to}
                onChange={(e) => setData("to", e.target.value)}
              />
              {errors.to && (
                <p className="text-red-500 text-sm">{errors.to}</p>
              )}
            </div>

            {/* Call Out Time */}
            <div className="space-y-1">
              <Label htmlFor="call_out_time">Call Out Time</Label>
              <Input
                id="call_out_time"
                type="time"
                value={data.call_out_time}
                onChange={(e) => setData("call_out_time", e.target.value)}
              />
              {errors.call_out_time && (
                <p className="text-red-500 text-sm">{errors.call_out_time}</p>
              )}
            </div>

            {/* Start Time */}
            <div className="space-y-1">
              <Label htmlFor="start_time">Start Time</Label>
              <Input
                id="start_time"
                type="time"
                value={data.start_time}
                onChange={(e) => setData("start_time", e.target.value)}
              />
              {errors.start_time && (
                <p className="text-red-500 text-sm">{errors.start_time}</p>
              )}
            </div>

            {/* End Time */}
            <div className="space-y-1">
              <Label htmlFor="end_time">End Time</Label>
              <Input
                id="end_time"
                type="time"
                value={data.end_time}
                onChange={(e) => setData("end_time", e.target.value)}
              />
              {errors.end_time && (
                <p className="text-red-500 text-sm">{errors.end_time}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Customer email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Telephone */}
            <div className="space-y-1">
              <Label htmlFor="tel">Telephone</Label>
              <Input
                id="tel"
                placeholder="Customer telephone"
                value={data.tel}
                onChange={(e) => setData("tel", e.target.value)}
              />
              {errors.tel && (
                <p className="text-red-500 text-sm">{errors.tel}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full border rounded p-2"
                rows={4}
                placeholder="Describe the job details"
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-4" disabled={processing}>
              {processing ? "Saving..." : "Save Job Card"}
            </Button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}