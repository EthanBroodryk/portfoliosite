"use client";

import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage, router } from "@inertiajs/react";

import JobInfoCard from "@/components/JobInfoCard";
import SignaturePad from "@/components/SignaturePad";
import BeforePhotosSection from "@/components/BeforePhotosSection";
import AfterPhotosSection from "@/components/AfterPhotosSection";
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

  beforePhotos: JobCardPhoto[];
  afterPhotos: JobCardPhoto[];
}

interface Technician {
  id: number;
  name: string;
}

interface Props {
  job: JobCard;
  technicians: Technician[];
}

export default function ShowJob() {
  const { job, technicians } = usePage<Props>().props;

  const [mode, setMode] = useState<"job" | "before" | "after">("job");
  const [hasSignature, setHasSignature] = useState(!!job.signature);

  const isCompleted = job.status === "completed";
  const hasBeforePhotos = job.beforePhotos.length > 0;
  const hasAfterPhotos = job.afterPhotos.length > 0;

  const canComplete =
    !isCompleted && hasSignature && hasBeforePhotos && hasAfterPhotos;

  const completeJob = () => {
    router.post(
      `/job-cards/${job.id}/complete`,
      {},
      {
        onSuccess: () => {
          router.reload();
        },
      }
    );
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "Job Cards", href: "/job-cards" },
        { title: job.job_number, href: "#" },
      ]}
    >
      <Head title={`Job ${job.job_number}`} />

      <div className="p-6 space-y-6">
        {/* MODE BUTTONS */}
        {!isCompleted && (
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
            <Button
              variant={mode === "job" ? "default" : "outline"}
              onClick={() => setMode("job")}
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
              disabled={!hasBeforePhotos}
              onClick={() => hasBeforePhotos && setMode("after")}
            >
              Upload After Photos
            </Button>
          </div>
        )}

        {/* JOB CARD MODE */}
        {mode === "job" && (
          <>
            <JobInfoCard job={job} />

            {/* SIGNATURE ONLY AFTER AFTER-PHOTOS EXIST */}
            {hasBeforePhotos && hasAfterPhotos && (
              <SignaturePad
                jobId={job.id}
                existingSignature={job.signature}
                isCompleted={isCompleted}
                onChange={setHasSignature}
              />
            )}

            {/* COMPLETE BUTTON — only if ready */}
            {canComplete && (
              <div className="pt-4">
                <Button
                  onClick={completeJob}
                  className="w-full font-semibold"
                >
                  Mark Job as Complete
                </Button>
              </div>
            )}

            {/* COMPLETED BADGE */}
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

        {/* BEFORE PHOTOS */}
        {mode === "before" && (
          <BeforePhotosSection
            jobId={job.id}
            existingPhotos={job.beforePhotos}
          />
        )}

        {/* AFTER PHOTOS */}
        {mode === "after" && hasBeforePhotos && (
          <AfterPhotosSection
            jobId={job.id}
            existingPhotos={job.afterPhotos}
          />
        )}
      </div>
    </AppLayout>
  );
}