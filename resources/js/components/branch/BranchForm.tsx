"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface BranchFormProps {
  form: {
    name: string;
    location: string;
    logo: File | null;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      location: string;
      logo: File | null;
    }>
  >;
}

export default function BranchForm({ form, setForm }: BranchFormProps) {
  const [preview, setPreview] = useState<string | null>(null);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, logo: file }));

      // preview
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }

  return (
    <div className="space-y-4 mt-4">
      <div>
        <label className="text-sm font-medium">Branch Name</label>
        <Input
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="Branch name"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Location</label>
        <Input
          value={form.location}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, location: e.target.value }))
          }
          placeholder="Location"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Branch Logo</label>
        <Input type="file" accept="image/*" onChange={handleLogoChange} />

        {preview && (
          <img
            src={preview}
            className="h-20 mt-2 rounded border object-contain"
          />
        )}
      </div>
    </div>
  );
}