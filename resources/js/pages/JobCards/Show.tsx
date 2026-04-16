"use client";

import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage, router } from "@inertiajs/react";

import JobInfoCard from "@/components/JobInfoCard";
import SignaturePad from "@/components/SignaturePad";
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

  const completeJob = () => {
    router.post(`/job-cards/${job.id}/complete`, {}, {
      onSuccess: () => {
        router.reload(); // 🔥 refresh status so UI updates
      },
    });
  };

  const isCompleted = job.status === "completed";

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Job Cards", href: "/job-cards" },
        { title: job.job_number, href: "#" },
      ]}
    >
      <Head title={`Job ${job.job_number}`} />

      <div className="p-6 space-y-6">

        {/* Toggle Buttons */}
        {!isCompleted && (
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
        )}

        {/* ===== JOB CARD MODE ===== */}
        {mode === "job" && (
          <>
            <JobInfoCard job={job} />

           <SignaturePad
              jobId={job.id}
              existingSignature={job.signature}
              isCompleted={job.status === "completed"}   // 🔥 ADD THIS
            />
            {/* =========================
                COMPLETION BUTTON STATE
            ========================= */}
            {job.signature && (
              <div className="pt-4">
                {isCompleted ? (
                  <Button
                    className="w-full font-semibold bg-green-600 hover:bg-green-700 text-white"
                    disabled
                  >
                    ✓ Job Completed
                  </Button>
                ) : (
                  <Button
                    onClick={completeJob}
                    className="w-full font-semibold"
                  >
                    Mark Job as Complete
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {/* ===== BEFORE PHOTOS MODE ===== */}
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