"use client";

import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

interface JobCard {
  id?: number;
  job_number: string;
  technician: string;
  description: string;
  status: string;

  customer_order_no?: string;
  date?: string;

  call_out?: string;
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

export default function JobInfoCard({
  job,
  onCompleteChange,
}: {
  job: JobCard;
  onCompleteChange?: (isComplete: boolean) => void;
}) {
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState<JobCard>({
    ...job,
    call_out: job.call_out || "",
  });

  // =============================
  // REQUIRED FIELDS CHECK
  // =============================
  const requiredFields: (keyof JobCard)[] = [
    "technician",
    "customer_order_no",
    "date",
    "client_name",
    "call_out",
    "call_out_time",
    "start_time",
    "end_time",
    "email",
    "tel",
    "description",
    "labour_hours",
    "travel_km",
  ];

  const isJobInfoComplete = requiredFields.every((field) => {
    const value = (form as any)[field];
    return value !== undefined && value !== null && value !== "" && value !== "N/A";
  });

  // send status to parent
  useEffect(() => {
    onCompleteChange?.(isJobInfoComplete);
  }, [isJobInfoComplete]);

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

  const renderField = (field: keyof JobCard) => {
    if (!editMode) {
      return (
        <p className="break-words">
          {(job as any)[field] || "N/A"}
        </p>
      );
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
        className="w-full border rounded px-2 py-1"
      />
    );
  };

  return (
    <div className="p-5 border rounded-lg space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{job.job_number}</h2>

        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="px-3 py-1 border rounded"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={saveJob}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Save
            </button>

            <button
              onClick={() => {
                setForm(job);
                setEditMode(false);
              }}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {[
          "technician",
          "customer_order_no",
          "date",
          "client_name",
          "call_out_time",
          "start_time",
          "end_time",
          "email",
          "tel",
        ].map((field) => (
          <div key={field}>
            <p className="font-semibold capitalize">
              {field.replace(/_/g, " ")}
            </p>
            {renderField(field as keyof JobCard)}
          </div>
        ))}
      </div>

      {/* CALL OUT */}
      <div className="p-4 border rounded-lg space-y-3">
        <p className="font-semibold">Call Out</p>

        <select
          name="call_out"
          value={form.call_out || ""}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select...</option>
          <option value="Normal hrs">Normal hrs</option>
          <option value="After hrs">After hrs</option>
        </select>

        <input
          type="text"
          name="labour_hours"
          value={form.labour_hours || ""}
          onChange={handleChange}
          placeholder="Labour Hours"
          className="w-full border rounded px-2 py-1"
        />

        <input
          type="text"
          name="travel_km"
          value={form.travel_km || ""}
          onChange={handleChange}
          placeholder="Travel KM"
          className="w-full border rounded px-2 py-1"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <p className="font-semibold">Job Description</p>

        {editMode ? (
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded p-2"
          />
        ) : (
          <p>{job.description}</p>
        )}
      </div>

      {/* REMARKS */}
      <div>
        <p className="font-semibold">Remarks</p>

        {editMode ? (
          <textarea
            name="remarks"
            value={form.remarks || ""}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded p-2"
          />
        ) : (
          <p>{job.remarks || "N/A"}</p>
        )}
      </div>
    </div>
  );
}