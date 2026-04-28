"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SignaturePad from "@/components/SignaturePad";
import { router } from "@inertiajs/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Technician {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

interface Photo {
  id: number;
  path: string;
}

interface JobCard {
  id: number;
  job_number: string;
  technician: string;
  branch?: string;
  description: string;
  status: string;
  signature?: string;
  date?: string;
  customer_order_no?: string;
  call_out_time?: string;
  start_time?: string;
  end_time?: string;
  to?: string;
  email?: string;
  tel?: string;
  beforePhotos?: Photo[];
  afterPhotos?: Photo[];
  [key: string]: any;
}


interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  job: JobCard | null;
  setJob: (job: JobCard | null) => void;
  onSave: () => void;
  technicians: Technician[];
  branches: Branch[];
  disableSignature?: boolean;
}

export default function JobCardEditModal({
  open,
  setOpen,
  job,
  setJob,
  onSave,
  technicians,
  branches,
}: Props) {
  if (!job) return null;

  const [hasSignature, setHasSignature] = useState(!!job.signature);
  const [photoType, setPhotoType] = useState<"before" | "after">("before");
  const [isEditing, setIsEditing] = useState(false);
  const disabled = !isEditing;
  const [originalJob, setOriginalJob] = useState<JobCard | null>(null);
  console.log("JOB REMARKS:", job.remarks);
  //console.log("JOB OBJECT:", job);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
          max-w-2xl
          w-[95vw]
          p-0
          bg-card
          border border-border
          rounded-lg
          max-h-[90vh]
          flex flex-col
          overflow-hidden
          [&>button]:hidden
        "
      >
        {/* HEADER */}
        <div className="p-4 border-b flex flex-col sm:flex-row sm:justify-between gap-3">
          <h2 className="text-lg font-bold">{job.job_number}</h2>

          <div className="flex gap-2">
            {!isEditing ? (
              // 👀 VIEW MODE → only EDIT
            <button
              onClick={() => {
                setOriginalJob(structuredClone(job)); // 👈 save clean copy
                setIsEditing(true);
              }}
              className="px-3 py-2 text-sm border rounded w-full sm:w-auto"
            >
              Edit
            </button>
            ) : (
              // ✏️ EDIT MODE → SAVE + CANCEL
              <>
                <button
                  onClick={() => {
                    onSave();
                    setIsEditing(false);
                  }}
                  className="px-3 py-2 text-sm bg-green-600 text-white rounded w-full sm:w-auto"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    if (originalJob) {
                      setJob(structuredClone(originalJob)); 
                    }
                    setIsEditing(false);
                  }}
                  className="px-3 py-2 text-sm border rounded w-full sm:w-auto"
                  >
                  Cancel
                </button>
              </>
            )}
          </div>
          
        </div>

        {/* BODY */}
        <div className="p-4 space-y-5 overflow-y-auto flex-1">

          {/* TECHNICIAN */}
          <div>
            <p className="font-semibold text-muted-foreground mb-1">Technician</p>

            <select
              disabled={disabled}
              value={job.technician || ""}
              onChange={(e) => setJob({ ...job, technician: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-background"
            >
              <option value="">Select technician</option>
              {technicians.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* BRANCH */}
          <div>
            <p className="font-semibold text-muted-foreground mb-1">Branch</p>

            <select
              disabled={disabled}
              value={job.branch_id?.toString() || ""}
              onChange={(e) =>
                setJob({ ...job, branch_id: Number(e.target.value) })
              }
              className="w-full border rounded px-3 py-2 bg-background"
            >
              <option value="">Select branch</option>

              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          {/* STATUS */}
          <div>
            <p className="font-semibold text-muted-foreground mb-1">Status</p>

            <Select
              disabled={disabled}
              value={job.status || ""}
              onValueChange={(v) => {
                // block completing without signature
                if (v === "completed" && !hasSignature) return;

                setJob({ ...job, status: v });
              }}
            >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent>
              {/* <SelectItem value="pending">Pending</SelectItem> */}
              <SelectItem value="return job">Return Job</SelectItem>
              <SelectItem
                value="completed"
                disabled={!hasSignature}
                >
                Completed
              </SelectItem>
            </SelectContent>
            </Select>
          </div>

          {/* DATE + TIME FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

            {/* DATE → Calendar */}
            <div>
              <p className="font-semibold text-muted-foreground mb-1">Date</p>
              <input
                disabled={disabled}
                type="date"
                value={job.date || ""}
                onChange={(e) => setJob({ ...job, date: e.target.value })}
                className="w-full border rounded px-3 py-2 bg-background"
              />
            </div>

            {/* CUSTOMER ORDER NO */}
            <div>
              <p className="font-semibold text-muted-foreground mb-1">Customer Order No</p>
              <input
                disabled={disabled}
                value={job.customer_order_no || ""}
                onChange={(e) =>
                  setJob({ ...job, customer_order_no: e.target.value })
                }
                className="w-full border rounded px-3 py-2 bg-background"
              />
            </div>

            {/* CALL OUT TIME → Clock */}
            <div>
              <p className="font-semibold text-muted-foreground mb-1">Call Out Time</p>
              <input
                disabled={disabled}
                type="time"
                value={job.call_out_time || ""}
                onChange={(e) =>
                  setJob({ ...job, call_out_time: e.target.value })
                }
                className="w-full border rounded px-3 py-2 bg-background"
              />
            </div>

                {job.checkins && job.checkins.length > 0 && (
  <div className="mt-2 rounded-lg border bg-background/50 overflow-hidden">
    
    {/* HEADER */}
    <div className="px-4 py-3 border-b bg-muted/40">
      <h3 className="text-sm font-semibold">Check-ins</h3>
    </div>

    {/* LIST */}
    <div className="divide-y">
      {job.checkins.map((c, index) => (
        <div key={c.id} className="p-4 space-y-2 text-sm">

          {/* TOP ROW */}
          <div className="flex justify-between items-center">
            <span className="font-medium capitalize text-foreground">
              {c.type}
            </span>

            <span className="text-xs text-muted-foreground">
              #{index + 1}
            </span>
          </div>

          {/* TIME */}
          <div className="text-muted-foreground text-xs">
            {new Date(c.checked_in_at).toLocaleString()}
          </div>

          {/* COORDINATES */}
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Lat:</span> {c.latitude} ·{" "}
            <span className="font-medium">Lng:</span> {c.longitude}
          </div>

          {/* GOOGLE MAPS LINK */}
          {c.latitude && c.longitude && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${c.latitude},${c.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              📍 View on Google Maps
            </a>
          )}

        </div>
      ))}
    </div>
  </div>
)}

            {/* START TIME → Clock */}
            <div>
              <p className="font-semibold text-muted-foreground mb-1">Start Time</p>
              <input
                disabled={disabled}
                type="time"
                value={job.start_time || ""}
                onChange={(e) => setJob({ ...job, start_time: e.target.value })}
                className="w-full border rounded px-3 py-2 bg-background"
              />
            </div>

            {/* END TIME → Clock */}
            <div>
              <p className="font-semibold text-muted-foreground mb-1">End Time</p>
              <input
                disabled={disabled}
                type="time"
                value={job.end_time || ""}
                onChange={(e) => setJob({ ...job, end_time: e.target.value })}
                className="w-full border rounded px-3 py-2 bg-background"
              />
            </div>

            {/* TO */}
            <div>
              <p className="font-semibold text-muted-foreground mb-1">To</p>
              <input
                disabled={disabled}
                value={job.to || ""}
                onChange={(e) => setJob({ ...job, to: e.target.value })}
                className="w-full border rounded px-3 py-2 bg-background"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <p className="font-semibold text-muted-foreground mb-1">Email</p>
            <input
              disabled={disabled}
              type="email"
              value={job.email || ""}
              onChange={(e) => setJob({ ...job, email: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-background"
            />
          </div>

          {/* TEL */}
          <div>
            <p className="font-semibold text-muted-foreground mb-1">Tel</p>
            <input
              disabled={disabled}
              value={job.tel || ""}
              onChange={(e) => setJob({ ...job, tel: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-background"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2 text-center">
              Job Description
            </p>

            <input
              disabled={disabled}
              type="text"
              value={job.description || ""}
              onChange={(e) => setJob({ ...job, description: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-background"
            />
          </div>

          {/* Remarks */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2 text-center">
              Remarks
            </p>
            <textarea
              disabled={disabled}
              value={job.remarks || ""}
              onChange={(e) => setJob({ ...job, remarks: e.target.value })}
              rows={4}
              className="w-full border rounded p-3 bg-background"
            />
          </div>

        

          {/* SIGNATURE */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2 text-center">
              Signature
            </p>
          </div>

          <SignaturePad
            jobId={job.id}
            existingSignature={job.signature}
            isCompleted={job.status === "completed"}
            onChange={setHasSignature}
            disableSignature={true}
          />

          {/* {hasSignature && job.status !== "completed" && (
            <button
             disabled={disabled}
              onClick={async () => {
                await router.post(`/job-cards/${job.id}/clear-signature`, {}, {
                  onSuccess: () => {
                    setHasSignature(false);
                    setJob({ ...job, signature: null });
                  },
                });
              }}
              className="px-3 py-2 text-sm bg-red-600 text-white rounded w-full"
              >
              Clear Signature
            </button>
          )} */}

          <div>
            <p className="font-semibold text-muted-foreground mb-1">Photos</p>

            <Select
              // disabled={disabled}
              value={photoType}
              onValueChange={(v: "before" | "after") => setPhotoType(v)}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select photo type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="before">Before Photos</SelectItem>
                <SelectItem value="after">After Photos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {photoType === "before" && job.beforePhotos && job.beforePhotos.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Before Photos
            </p>

            <div className="grid grid-cols-3 gap-2">
              {job.beforePhotos.map((photo) => (
                <img
                  key={photo.id}
                  src={`/storage/${photo.path}`}
                  className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-80"
                  onClick={() => window.open(`/storage/${photo.path}`, "_blank")}
                />
              ))}
            </div>
          </div>
        )}

        {photoType === "after" && job.afterPhotos && job.afterPhotos.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">
            After Photos
            </p>

            <div className="grid grid-cols-3 gap-2">
              {job.afterPhotos.map((photo) => (
              <img
                key={photo.id}
                src={`/storage/${photo.path}`}
                className="w-full h-24 object-cover rounded border cursor-pointer hover:opacity-80"
                onClick={() => window.open(`/storage/${photo.path}`, "_blank")}
              />
              ))}
            </div>
          </div>
        )}

        </div>
      </DialogContent>
    </Dialog>
  );
}