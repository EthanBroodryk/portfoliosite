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

  call_out?: string; // Normal hrs / After hrs
  call_out_time?: string;
  start_time?: string;
  end_time?: string;

  labour_hours?: string;
  travel_km?: string;
  remarks?: string;
  client_name?: string;

  email?: string;
  tel?: string;
}

export default function JobInfoCard({ job }: { job: JobCard }) {
  const [editMode, setEditMode] = useState(false);
  const isCompleted = job.status === "completed";

  const [form, setForm] = useState<JobCard>({
    ...job,
    call_out: job.call_out || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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

  const renderInput = (field: keyof JobCard) => {
    if (field === "status") {
      return <p className="break-words">{job.status}</p>;
    }

    if (!editMode) {
      return <p className="break-words">{(job as any)[field] || "N/A"}</p>;
    }

    const isTimeField =
      field === "call_out_time" ||
      field === "start_time" ||
      field === "end_time";

    return (
      <input
        type={isTimeField ? "time" : "text"}
        name={field}
        value={(form as any)[field] || ""}
        onChange={handleChange}
        className="w-full border rounded px-2 py-1 bg-background"
      />
    );
  };

  return (
    <div className="p-5 border border-border rounded-lg bg-card text-foreground space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{job.job_number}</h2>

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

      {/* GRID (cleaned — call_out removed here) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

        {[
          "technician",
          "status",
          "customer_order_no",
          "date",
          "to",
          "client_name",
          "call_out_time",
          "start_time",
          "end_time",
          "labour_hours",
          "travel_km",
          "email",
          "tel",
        ].map((field) => (
          <div key={field}>
            <p className="font-semibold text-muted-foreground capitalize">
              {field.replace(/_/g, " ")}
            </p>
            {renderInput(field as keyof JobCard)}
          </div>
        ))}
      </div>

      {/* CALL OUT SECTION */}
      <div className="mt-6 p-4 border border-border rounded-lg bg-muted/20">
        <p className="text-sm font-semibold text-muted-foreground mb-3 text-center">
          Call Out
        </p>

        {/* CALL OUT DROPDOWN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

          <div>
            <p className="font-semibold text-muted-foreground">Call Out Type</p>

            {!editMode ? (
              <p>{job.call_out || "N/A"}</p>
            ) : (
              <select
                name="call_out"
                value={form.call_out || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 bg-background"
              >
                <option value="">Select...</option>
                <option value="Normal hrs">Normal hrs</option>
                <option value="After hrs">After hrs</option>
              </select>
            )}
          </div>

          {/* LABOUR HOURS */}
          <div>
            <p className="font-semibold text-muted-foreground">Labour @ Hours</p>
            {!editMode ? (
              <p>{job.labour_hours || "N/A"}</p>
            ) : (
              <input
                type="text"
                name="labour_hours"
                value={form.labour_hours || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 bg-background"
              />
            )}
          </div>

          {/* TRAVEL KM */}
          <div>
            <p className="font-semibold text-muted-foreground">Traveling @ KM</p>
            {!editMode ? (
              <p>{job.travel_km || "N/A"}</p>
            ) : (
              <input
                type="text"
                name="travel_km"
                value={form.travel_km || ""}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 bg-background"
              />
            )}
          </div>

        </div>
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

      {/* REMARKS */}
      <div className="mt-4">
        <p className="text-sm font-semibold text-muted-foreground mb-2 text-center">
          Remarks
        </p>

        {editMode ? (
          <textarea
            name="remarks"
            value={form.remarks || ""}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded p-3 bg-background"
          />
        ) : (
          <div className="border border-border rounded-lg bg-muted/30 p-4">
            <p className="text-center whitespace-pre-wrap">
              {job.remarks || "N/A"}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}