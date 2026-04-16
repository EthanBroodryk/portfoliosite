"use client";

import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage, router } from "@inertiajs/react";

import JobInfoCard from "@/components/JobInfoCard";
import SignaturePad from "@/components/SignaturePad";
import BeforePhotosSection from "@/components/BeforePhotosSection";
import { Button } from "@/components/ui/button";
import AfterPhotosSection from "@/components/AfterPhotosSection";

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

  beforePhotos: JobCardPhoto[];
  afterPhotos: JobCardPhoto[];
}



interface Props {
  job: JobCard;
}

export default function ShowJob() {
const { job } = usePage<{ job: JobCard }>().props;

  const [mode, setMode] = useState<"job" | "photos" | "after">("job");
  
const [hasSignature, setHasSignature] = useState(!!job.signature);
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
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
            <Button
              variant={mode === "job" ? "default" : "outline"}
              onClick={() => setMode("job")}
              className="px-4"
            >
              Open Job Card
            </Button>

            <Button
  variant={mode === "before" ? "default" : "outline"}
  onClick={() => setMode("before")}
>
  Upload Before Photos
</Button>

<Button
  variant={mode === "after" ? "default" : "outline"}
  onClick={() => setMode("after")}
>
  Upload After Photos
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
              isCompleted={job.status === "completed"}
              onChange={setHasSignature}
            />
             {/* =========================
                COMPLETION BUTTON STATE
            ========================= */}
            {hasSignature && !isCompleted && (
              <div className="pt-4">
                <Button
                  onClick={completeJob}
                  className="w-full font-semibold"
                >
                  Mark Job as Complete
                </Button>
              </div>
            )}

            {isCompleted && (
              <div className="pt-4">
                <Button
                  className="w-full font-semibold bg-green-600 hover:bg-green-700 text-white"
                  disabled
                >
                  ✓ Job Completed
                </Button>
              </div>
            )}
          </>
        )}

        {/* ===== BEFORE PHOTOS MODE ===== */}
        {mode === "before" && (
            <BeforePhotosSection
              jobId={job.id}
              existingPhotos={job.beforePhotos}
            />
          )}

          {mode === "after" && (
            <AfterPhotosSection
              jobId={job.id}
              existingPhotos={job.afterPhotos}
            />
          )}

        
      </div>
    </AppLayout>
  );
}