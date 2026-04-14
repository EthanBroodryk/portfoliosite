"use client";

import { FormEvent } from "react";
import { useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { PageProps as InertiaPageProps } from "@inertiajs/core";

/**
 * =========================
 * TYPES
 * =========================
 */
interface Technician {
  id: number;
  name: string;
}

interface PageProps extends InertiaPageProps {
  technicians: Technician[];
}

/**
 * =========================
 * COMPONENT
 * =========================
 */
export default function CreateJobCard() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Job Cards", href: "/job-cards" },
    { title: "Create Job Card", href: "/job-cards/create" },
  ];

  const { technicians } = usePage<PageProps>().props;

const { data, setData, post, processing, errors } = useForm({
  date: "",
  technician: "", // ✅ changed from technician_id
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

  post("/job-cards", {
    onSuccess: () => {
      setData({
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
    },
  });
};

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Job Card" />

      <div className="flex justify-center py-10">
        <div className="w-full max-w-xl p-6 border rounded-md shadow-sm">
          <h1 className="text-2xl font-bold mb-6">Create Job Card</h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* DATE */}
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

            {/* TECHNICIAN */}
            <div className="space-y-1">
              <Label htmlFor="technician">Technician</Label>

              <Select
                value={data.technician}
                onValueChange={(value) => setData("technician", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>

                <SelectContent>
                  {technicians.map((t) => (
                    <SelectItem key={t.id} value={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.technician && (
                <p className="text-red-500 text-sm">
                  {errors.technician}
                </p>
              )}
            </div>

            {/* CUSTOMER ORDER NO */}
            <div className="space-y-1">
              <Label htmlFor="customer_order_no">Customer O/No</Label>
              <Input
                id="customer_order_no"
                value={data.customer_order_no}
                onChange={(e) =>
                  setData("customer_order_no", e.target.value)
                }
              />
              {errors.customer_order_no && (
                <p className="text-red-500 text-sm">
                  {errors.customer_order_no}
                </p>
              )}
            </div>

            {/* TO */}
            <div className="space-y-1">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                value={data.to}
                onChange={(e) => setData("to", e.target.value)}
              />
              {errors.to && (
                <p className="text-red-500 text-sm">{errors.to}</p>
              )}
            </div>

            {/* CALL OUT TIME */}
            <div className="space-y-1">
              <Label>Call Out Time</Label>
              <Input
                type="time"
                value={data.call_out_time}
                onChange={(e) =>
                  setData("call_out_time", e.target.value)
                }
              />
            </div>

            {/* START TIME */}
            <div className="space-y-1">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={data.start_time}
                onChange={(e) =>
                  setData("start_time", e.target.value)
                }
              />
            </div>

            {/* END TIME */}
            <div className="space-y-1">
              <Label>End Time</Label>
              <Input
                type="time"
                value={data.end_time}
                onChange={(e) =>
                  setData("end_time", e.target.value)
                }
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
              />
            </div>

            {/* TEL */}
            <div className="space-y-1">
              <Label>Telephone</Label>
              <Input
                value={data.tel}
                onChange={(e) => setData("tel", e.target.value)}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1">
              <Label>Description</Label>
              <textarea
                className="w-full border rounded p-2"
                rows={4}
                value={data.description}
                onChange={(e) =>
                  setData("description", e.target.value)
                }
              />
            </div>

            {/* SUBMIT */}
            <Button
              type="submit"
              className="w-full mt-4"
              disabled={processing}
            >
              {processing ? "Saving..." : "Save Job Card"}
            </Button>

          </form>
        </div>
      </div>
    </AppLayout>
  );
}