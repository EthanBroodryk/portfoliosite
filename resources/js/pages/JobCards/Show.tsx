"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage, router } from "@inertiajs/react";

import JobInfoCard from "@/components/JobInfoCard";
import SignaturePad from "@/components/SignaturePad";
import BeforePhotosSection from "@/components/BeforePhotosSection";
import AfterPhotosSection from "@/components/AfterPhotosSection";
import { Button } from "@/components/ui/button";

// ======================
// TYPES
// ======================
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

// ======================
// PAGE
// ======================
export default function ShowJob() {

  const { job } = usePage<Props>().props;
  const [jobInfoComplete, setJobInfoComplete] = useState(false);
  const isCompleted = job.status === "completed";
  const isReturnJob = job.status === "return job"
  const hasBeforePhotos = job.beforePhotos.length > 0;
  const hasAfterPhotos = job.afterPhotos.length > 0;
  const [jobSaved, setJobSaved] = useState(false);

  const [step, setStep] = useState<
    "start" | "before" | "job" | "after" | "signature"
  >("start");

  const [hasSignature, setHasSignature] = useState(!!job.signature);

  // ======================
  // AUTO STEP SYNC (important)
  // ======================
  useEffect(() => {
    if (hasBeforePhotos && !hasAfterPhotos) {
      setStep("job");
    }

    if (hasBeforePhotos && hasAfterPhotos && !job.signature) {
      setStep("signature");
    }

    if (job.signature && isCompleted) {
      setStep("signature");
    }
  }, [job]);

  const canComplete =
    !isCompleted && hasSignature && hasBeforePhotos && hasAfterPhotos;

  const completeJob = () => {
    router.post(
      `/job-cards/${job.id}/complete`,
      {},
      {
        onSuccess: () => router.reload(),
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

        {/* ======================
            START BUTTON
        ====================== */}
        {step === "start" && !isCompleted && !isReturnJob &&(
          <Button
            className="bg-green-600 hover:bg-green-700 text-white w-full"
            onClick={() => setStep("before")}
          >
            Start Job
          </Button>
        )}

        {/* ======================
            BEFORE PHOTOS
        ====================== */}
        {(step === "before" || isReturnJob) && (
          <>
            <BeforePhotosSection
              jobId={job.id}
              existingPhotos={job.beforePhotos}
            />

            {hasBeforePhotos && !isReturnJob && (
              <Button
                className="bg-green-600 text-white w-full"
                onClick={() => setStep("job")}
              >
                Continue to Job Card
              </Button>
            )}
          </>
        )}

        {/* ======================
            JOB CARD
        ====================== */}
        {(step === "job" || isReturnJob) && hasBeforePhotos && (
        <>
          <JobInfoCard
            job={job}
            onCompleteChange={setJobInfoComplete}
          />

          {jobInfoComplete && !isReturnJob  && (
            <Button
              className="bg-green-600 text-white w-full"
              onClick={() => setStep("after")}
            >
              Continue to After Photos
            </Button>
          )}
        </>
      )}
        {/* ======================
            AFTER PHOTOS
        ====================== */}
        {(step === "after" || isReturnJob) && hasBeforePhotos && (
          <>
            <AfterPhotosSection
              jobId={job.id}
              existingPhotos={job.afterPhotos}
            />

            {hasAfterPhotos && !isReturnJob  && (
              <Button
                className="bg-green-600 text-white w-full"
                onClick={() => setStep("signature")}
              >
                Continue to Signature
              </Button>
            )}
          </>
        )}

        {/* ======================
            SIGNATURE
        ====================== */}
        {(step === "signature" || isReturnJob) &&
          hasBeforePhotos &&
          hasAfterPhotos && (
            <>
              <SignaturePad
                jobId={job.id}
                existingSignature={job.signature}
                isCompleted={isCompleted}
                onChange={setHasSignature}
              />

              {canComplete && jobInfoComplete && (
                <Button
                  onClick={completeJob}
                  className="w-full font-semibold bg-green-600 hover:bg-green-700 text-white"
                >
                  Mark Job as Complete
                </Button>
              )}

              {isCompleted && (
                <Button
                  disabled
                  className="w-full bg-green-600 text-white"
                >
                  ✓ Job Completed
                </Button>
              )}
            </>
          )}
      </div>
    </AppLayout>
  );
}