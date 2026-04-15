"use client";

import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";

import JobInfoCard from "@/components/JobInfoCard";
import SignaturePad from "@/components/SignaturePad";
import SavedSignature from "@/components/SavedSignature";
import AddActionButtons from "@/components/AddActionButtons";
import BeforePhotosSection from "@/components/BeforePhotosSection";

interface JobCard {
  id: number;
  job_number: string;
  technician: string;
  description: string;
  status: string;
  created_at: string;
  signature?: string;
}

interface Props {
  job: JobCard;
}

export default function ShowJob() {
  const { job } = usePage<Props>().props;

  const [showPhotos, setShowPhotos] = useState(false);
  const [showJob, setShowJob] = useState(false);

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Job Cards", href: "/job-cards" },
        { title: job.job_number, href: "#" },
      ]}
    >
      <Head title={`Job ${job.job_number}`} />

      <div className="p-6 space-y-6">

        {/* ACTION BUTTONS */}
        <AddActionButtons
          onAddPhotos={() => {
            setShowPhotos(true);
            setShowJob(false);
          }}
          onOpenJob={() => {
            setShowJob(true);
            setShowPhotos(false);
          }}
        />

        {/* BEFORE PHOTOS */}
        {showPhotos && (
          <BeforePhotosSection jobId={job.id} />
        )}

        {/* JOB CARD */}
        {showJob && (
          <>
            <JobInfoCard job={job} />
            <SignaturePad jobId={job.id} />
            {job.signature && (
              <SavedSignature signature={job.signature} />
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}