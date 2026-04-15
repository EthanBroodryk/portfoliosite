"use client";

import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";

import JobInfoCard from "@/components/JobInfoCard";
import SignaturePad from "@/components/SignaturePad";
import SavedSignature from "@/components/SavedSignature";
import BeforePhotosSection from "@/components/BeforePhotosSection";
import { Button } from "@/components/ui/button";

interface JobCardPhoto {
  id: number;
  path: string;
}

interface JobCard {
  id: number;
  job_number: string;
  technician: string;
  description: string;
  status: string;
  created_at: string;
  signature?: string;
  photos?: JobCardPhoto[];
}

interface Props {
  job: JobCard;
}

export default function ShowJob() {
  const { job } = usePage<Props>().props;

  const [mode, setMode] = useState<"job" | "photos">("job");

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Job Cards", href: "/job-cards" },
        { title: job.job_number, href: "#" },
      ]}
    >
      <Head title={`Job ${job.job_number}`} />

      <div className="p-6 space-y-6">

        {/* Toggle Buttons styled like original */}
        <div className="flex gap-3">
          <Button
            variant={mode === "job" ? "default" : "outline"}
            onClick={() => setMode("job")}
            className="px-4"
          >
            Open Job Card
          </Button>

          <Button
            variant={mode === "photos" ? "default" : "outline"}
            onClick={() => setMode("photos")}
            className="px-4"
          >
            Upload Before Photos
          </Button>
        </div>

        {/* ========= JOB CARD MODE ========= */}
        {mode === "job" && (
          <>
            <JobInfoCard job={job} />

            <SignaturePad
            jobId={job.id}
            existingSignature={job.signature}
            />

           
          </>
        )}

        {/* ========= BEFORE PHOTOS MODE ========= */}
        {mode === "photos" && (
          <BeforePhotosSection
            jobId={job.id}
            existingPhotos={job.photos || []}
          />
        )}
      </div>
    </AppLayout>
  );
}