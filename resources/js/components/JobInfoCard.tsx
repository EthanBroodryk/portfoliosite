"use client";

import { useState } from "react";
import { router } from "@inertiajs/react";

interface JobCard {
  id?: number;
  job_number: string;
  technician: string;
  description: string;
  status: string;
  customer_order_no?: string;
  date?: string;
  to?: string;
  call_out_time?: string;
  start_time?: string;
  end_time?: string;
  email?: string;
  tel?: string;
}

export default function JobInfoCard({ job }: { job: JobCard }) {
  const [editMode, setEditMode] = useState(false);
  const isCompleted = job.status === "completed";
  const [form, setForm] = useState<JobCard>({
    ...job,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveJob = () => {
    router.put(`/job-cards/${job.id}`, form, {
      preserveScroll: true,
      onSuccess: () => setEditMode(false),
    });
  };

  return (
    <div className="p-5 border border-border rounded-lg bg-card text-foreground space-y-6">

      {/* HEADER + EDIT BUTTON */}
 {/* HEADER + EDIT BUTTON */}
<div className="flex justify-between items-center">
  <h2 className="text-xl font-bold">{job.job_number}</h2>

  {/* 🚫 LOCK EDIT IF COMPLETED */}
  {isCompleted ? (
    <span className="text-green-600 font-semibold text-sm">
      ✓ Completed (Locked)
    </span>
  ) : !editMode ? (
    <button
      onClick={() => setEditMode(true)}
      className="px-3 py-1 text-sm border rounded bg-muted hover:bg-muted/70"
    >
      Edit
    </button>
  ) : (
    <div className="flex gap-2">
      <button
        onClick={saveJob}
        className="px-3 py-1 text-sm bg-green-600 text-white rounded"
      >
        Save
      </button>

      <button
        onClick={() => {
          setForm(job);
          setEditMode(false);
        }}
        className="px-3 py-1 text-sm border rounded"
      >
        Cancel
      </button>
    </div>
  )}
</div>

      {/* GRID */}
     
     {/* GRID */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

  {[
    "technician",
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

      {editMode ? (
        <input
          name={field}
          value={(form as any)[field] || ""}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 bg-background"
        />
      ) : (
        <p className="break-words">
          {(job as any)[field] || "N/A"}
        </p>
      )}
    </div>
  ))}
</div>

      {/* DESCRIPTION */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-muted-foreground mb-2 text-center">
          Job Description
        </p>

        {editMode ? (
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded p-3 bg-background"
          />
        ) : (
          <div className="border border-border rounded-lg bg-muted/30 p-4">
            <p className="text-center whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}