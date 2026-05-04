"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, usePage, router } from "@inertiajs/react";

import JobInfoCard from "@/components/JobInfoCard";
import SignaturePad from "@/components/SignaturePad";
import BeforePhotosSection from "@/components/BeforePhotosSection";
import AfterPhotosSection from "@/components/AfterPhotosSection";
import { Button } from "@/components/ui/button";
import StartJobButton from "@/components/StartJobButton";

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
  const [isEditing, setIsEditing] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const isCompleted = job.status === "completed";
  const isReturnJob = job.status === "return job";
  const [returnJobStarted, setReturnJobStarted] = useState(false);
  const hasBeforePhotos = job.beforePhotos.length > 0;
  const hasAfterPhotos = job.afterPhotos.length > 0;

  // ======================
  // STEP STATE
  // ======================
  const [step, setStep] = useState<
    "start" | "before" | "job" | "after" | "signature"
  >("start");

  const [manualOverride, setManualOverride] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!job.signature);
  const [startingJob, setStartingJob] = useState(false);
 
  const hasStarted = job.status !== "pending" && job.status !== "return job";
   const canStart = !isCompleted &&  job.status !== "in progress" && step === "start" && (!isReturnJob || !returnJobStarted);


  const handleStartJob = () => {
    if (startingJob) return; 
    setStartingJob(true);

   

  if (isReturnJob) {
    setReturnJobStarted(true);
  }

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setManualOverride(true);
           
                router.post(`/job-cards/${job.id}/checkin`, {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
                timestamp: new Date().toLocaleString("en-ZA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }),
                 type: isReturnJob ? "return" : "start",
            }, {
              
                preserveScroll: true,
                preserveState: true,
                 //preserveState: false,
            });
               setStep("before");
            },
            (err) => {
              // still continue UI anyway
              setManualOverride(true);
              setStep("before");

              router.post(`/job-cards/${job.id}/checkin`, {
                latitude: null,
                longitude: null,
                error: err.message,
              });
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 10000,
            }
          );
  }

  // ======================
  // SAFE STEP SYNC (FIXED)
  // ======================
  useEffect(() => {
    if (manualOverride) return;
    if (!job) return;

    // if (job.status === "return job" && !returnJobStarted) {
    //   setStep("start");
    //   return;
    // }
    if (job.status === "return job" && !returnJobStarted && step !== "before") {
      setStep("start");
      return;
    }

    if (job.signature) {
      setStep("signature");
      return;
    }

    if (job.afterPhotos.length > 0) {
      setStep("after");
      return;
    }

    if (job.beforePhotos.length > 0) {
      setStep("job");
      return;
    }

    if(job.beforePhotos.length <= 0 && job.status == "in progress"){
      setStep("before");
    }

    //setStep("start");
  }, [job]);

  // ======================
  // JOB INFO VALIDATION
  // ======================
  useEffect(() => {
    const required = [
      "technician",
      "customer_order_no",
      "date",
      "client_name",
      "call_out_time",
      "start_time",
      "end_time",
      "email",
      "tel",
      "description",
    ];

    const isComplete = required.every((field) => {
      const v = (job as any)[field];
      return v !== undefined && v !== null && v !== "" && v !== "N/A";
    });

    setJobInfoComplete(isComplete);
  }, [job]);

  // ======================
  // COMPLETE BUTTON
  // ======================
  // const canComplete =
  //   !isCompleted &&
  //   !isSigning &&
  //   hasSignature &&
  //   hasBeforePhotos &&
  //   hasAfterPhotos &&
  //   !isEditing;
  const canComplete =
  !isCompleted &&
  !isSigning &&
  hasSignature &&
  hasBeforePhotos &&
  hasAfterPhotos &&
  !isEditing 
  // &&
  // (!isReturnJob || returnJobStarted);

  const completeJob = () => {
    router.post(`/job-cards/${job.id}/complete`, {}, {
      onSuccess: () => router.reload(),
    });
  };

  // ======================
  // UI
  // ======================


 console.log("canComplete:", canComplete);
console.log("jobInfoComplete:", jobInfoComplete);
console.log("isEditing:", isEditing);

// console.log(
//   "FINAL CHECK:",
//   canComplete && jobInfoComplete && !isEditing
// );
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
            START
        ====================== */}
         {/* {step === "start" && !isCompleted && !isReturnJob && ( 
        
          <StartJobButton
            onClick={handleStartJob}
            disabled={startingJob}
            label={startingJob ? "Starting..." : "Start Job"}
          />
        )} */}

      {canStart && (
        <StartJobButton
          onClick={handleStartJob}
          disabled={startingJob}
          label={startingJob ? "Starting..." : "Start Job"}
        />
      )}

        {/* ======================
            BEFORE PHOTOS
        ====================== */}
        {(step === "before") && (
          <>
            <BeforePhotosSection
              jobId={job.id}
              existingPhotos={job.beforePhotos}
            />

            {hasBeforePhotos && (
              <Button
                className="bg-green-600 text-white w-full"
                onClick={() => {
                  setManualOverride(true);
                  setStep("job");
                }}
              >
                Continue to Job Card
              </Button>
            )}
          </>
        )}

        {/* ======================
            JOB CARD
        ====================== */}
        {(step === "job") && hasBeforePhotos && (
          <>
            <JobInfoCard
              job={job}
              onCompleteChange={setJobInfoComplete}
              onEditChange={setIsEditing}
            />

            {/* {jobInfoComplete && !isEditing && !isReturnJob && ( */}
            {jobInfoComplete && !isEditing && (
              <Button
                className="bg-green-600 text-white w-full"
                onClick={() => {
                  setManualOverride(true);
                  setStep("after");
                }}
              >
                Continue to After Photos
              </Button>
            )}
          </>
        )}

        {/* ======================
            AFTER PHOTOS
        ====================== */}
        {(step === "after") && hasBeforePhotos && (
          <>
            <AfterPhotosSection
              jobId={job.id}
              existingPhotos={job.afterPhotos}
            />

            {hasAfterPhotos &&  (
              <Button
                className="bg-green-600 text-white w-full"
                onClick={() => {
                  setManualOverride(true);
                  setStep("signature");
                }}
              >
                Continue to Signature
              </Button>
            )}
          </>
        )}

        {/* ======================
            SIGNATURE
        ====================== */}
        {(step === "signature") &&
          hasBeforePhotos &&
          hasAfterPhotos && (
            <>
              <SignaturePad
                jobId={job.id}
                existingSignature={job.signature}
                isCompleted={isCompleted}
                onChange={setHasSignature}
                onSigningChange={setIsSigning}
              />

              {canComplete && jobInfoComplete && !isEditing && (
                <Button
                  onClick={completeJob}
                  className="w-full font-semibold bg-green-600 hover:bg-green-700 text-white"
                >
                  Mark Job as Complete
                </Button>
              )}

              {isCompleted && (
                <Button disabled className="w-full bg-green-600 text-white">
                  ✓ Job Completed
                </Button>
              )}
            </>
          )}
      </div>
    </AppLayout>
  );
}