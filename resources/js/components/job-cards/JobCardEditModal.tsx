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
      <DialogContent className="max-w-2xl p-0 bg-card border border-border rounded-lg">
        <div className="p-5 space-y-6">

          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {job.job_number}
            </h2>

            <div className="flex gap-2">
              <button
                onClick={onSave}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                  setJob(null);
                }}
                className="px-3 py-1 text-sm border rounded"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

                {/* 👇 TECHNICIAN DROPDOWN */}
            <div>
              <p className="font-semibold text-muted-foreground capitalize">
                Technician
              </p>

              <select
                value={job.technician || ""}
                onChange={(e) =>
                  setJob({
                    ...job,
                    technician: e.target.value,
                  })
                }
                className="w-full border rounded px-2 py-1 bg-background"
              >
                <option value="">Select technician</option>

                {technicians.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            {[
              "status",
              "customer_order_no",
              "date",
              "to",
              "call_out_time",
              "start_time",
              "end_time",
              "email",
              "tel",
            ].map((field) => (
              <div key={field}>
                <p className="font-semibold text-muted-foreground capitalize">
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
                  className="w-full border rounded px-2 py-1 bg-background"
                />
              </div>
            ))}

        
          </div>

          {/* DESCRIPTION */}
          <div className="mt-6">
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