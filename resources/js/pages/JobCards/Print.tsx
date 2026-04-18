"use client";

import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

// your component (IMPORTANT)
import JobCardPrintView from "@/components/JobCardPrintView";

interface JobCard {
  id: number;
  job_number: string;
  technician: string;
  description: string;
  status: string;
  created_at: string;
    branch?: {
    id: number;
    name: string;
    logo?: string;
  }; 
  customer_order_no?: string;
  date?: string;
  to?: string;
  call_out_time?: string;
  start_time?: string;
  end_time?: string;
  email?: string;
  tel?: string;
  signature?: string;
  photos?: any[];
}

interface Props {
  job: JobCard;
}

export default function PrintJobCard() {
  const { job } = usePage<Props>().props;

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Job Cards", href: "/job-cards" },
        { title: "Print View", href: "#" },
      ]}
    >
      <Head title={`Print Job ${job.job_number}`} />

      <div className="p-6 space-y-4">

        {/* PRINT BUTTON */}
        <div className="flex justify-end">
          <Button onClick={() => window.print()} variant="secondary">
            Print / Save PDF
          </Button>
        </div>

        {/* PRINT COMPONENT */}
        <JobCardPrintView job={job} />
      </div>
    </AppLayout>
  );
}