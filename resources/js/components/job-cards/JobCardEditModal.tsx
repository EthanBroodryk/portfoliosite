"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface Technician {
  id: number;
  name: string;
}

interface JobCard {
  id: number;
  job_number: string;
  technician: string;
  description: string;
  status: string;
  [key: string]: any;
}

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  job: JobCard | null;
  setJob: (job: JobCard | null) => void;
  onSave: () => void;
  technicians: Technician[];
}

export default function JobCardEditModal({
  open,
  setOpen,
  job,
  setJob,
  onSave,
  technicians,
}: Props) {
  if (!job) return null;

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
        "
      >
        {/* HEADER (fixed) */}
        <div className="p-4 border-b flex flex-col sm:flex-row sm:justify-between gap-3">
          <h2 className="text-lg font-bold">
            {job.job_number}
          </h2>

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

        {/* BODY (scrollable) */}
        <div className="p-4 space-y-5 overflow-y-auto flex-1">

          {/* TECHNICIAN */}
          <div>
            <p className="font-semibold text-muted-foreground mb-1">
              Technician
            </p>

            <select
              value={job.technician || ""}
              onChange={(e) =>
                setJob({ ...job, technician: e.target.value })
              }
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

          {/* FIELDS */}
              {/* FIELDS */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

  {[
    "status",
    "customer_order_no",
    "date",
    "to",
    "call_out_time",
    "start_time",
    "end_time",
  ].map((field) => (
    <div key={field}>
      <p className="font-semibold text-muted-foreground capitalize mb-1">
        {field.replace(/_/g, " ")}
      </p>

      <input
        value={job[field] || ""}
        onChange={(e) =>
          setJob({
            ...job,
            [field]: e.target.value,
          })
        }
        className="w-full border rounded px-3 py-2 bg-background"
      />
    </div>
  ))}
</div>

    {/* FULL WIDTH EMAIL */}
    <div>
    <p className="font-semibold text-muted-foreground mb-1">
        Email
    </p>

    <input
        value={job.email || ""}
        onChange={(e) =>
        setJob({
            ...job,
            email: e.target.value,
        })
        }
        className="w-full border rounded px-3 py-2 bg-background"
        type="email"
    />
    </div>

    {/* FULL WIDTH TEL (optional but recommended) */}
    <div>
    <p className="font-semibold text-muted-foreground mb-1">
        Tel
    </p>

    <input
        value={job.tel || ""}
        onChange={(e) =>
        setJob({
            ...job,
            tel: e.target.value,
        })
        }
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
              onChange={(e) =>
                setJob({
                  ...job,
                  description: e.target.value,
                })
              }
              rows={4}
              className="w-full border rounded p-3 bg-background"
            />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}