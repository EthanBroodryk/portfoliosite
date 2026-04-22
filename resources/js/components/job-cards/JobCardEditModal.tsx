"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SignaturePad from "@/components/SignaturePad";
import { router } from "@inertiajs/react";

interface Technician {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

interface JobCard {
  id: number;
  job_number: string;
  technician: string;
  branch?: string;
  description: string;
  status: string;
  signature?: string;
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
            <button
              onClick={onSave}
              className="px-3 py-2 text-sm bg-green-600 text-white rounded w-full sm:w-auto"
            >
              Save
            </button>

            <button
              onClick={() => {
                setOpen(false);
                setJob(null);
              }}
              className="px-3 py-2 text-sm border rounded w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-5 overflow-y-auto flex-1">

          {/* TECHNICIAN */}
          <div>
            <p className="font-semibold text-muted-foreground mb-1">Technician</p>

            <select
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
              value={job.branch || ""}
              onChange={(e) => setJob({ ...job, branch: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-background"
            >
              <option value="">Select branch</option>
              {branches.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* STATUS */}
          <div>
            <p className="font-semibold text-muted-foreground mb-1">Status</p>

            <select
              value={job.status || ""}
              onChange={(e) => setJob({ ...job, status: e.target.value })}
              className="w-full border rounded px-3 py-2 bg-background"
            >
              <option value="">Select status</option>
              <option value="completed">Completed</option>
              <option value="return job">Return Job</option>
            </select>
          </div>

          {/* DATE + TIME FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

            {/* DATE → Calendar */}
            <div>
              <p className="font-semibold text-muted-foreground mb-1">Date</p>
              <input
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
                type="time"
                value={job.call_out_time || ""}
                onChange={(e) =>
                  setJob({ ...job, call_out_time: e.target.value })
                }
                className="w-full border rounded px-3 py-2 bg-background"
              />
            </div>

            {/* START TIME → Clock */}
            <div>
              <p className="font-semibold text-muted-foreground mb-1">Start Time</p>
              <input
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
            <textarea
              value={job.description || ""}
              onChange={(e) => setJob({ ...job, description: e.target.value })}
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

          {hasSignature && job.status !== "completed" && (
            <button
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
          )}



        </div>
      </DialogContent>
    </Dialog>
  );
}