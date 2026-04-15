"use client";

import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function BeforePhotosSection({
  jobId,
}: {
  jobId: number;
}) {
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // =============================
  // HANDLE FILE SELECT
  // =============================
  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newPhotos: string[] = [];

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newPhotos.push(url);
    });

    setPhotos((prev) => [...prev, ...newPhotos]);

    // SEND TO BACKEND
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("photos[]", file);
    });

    router.post(`/job-cards/${jobId}/before-photos`, formData, {
      forceFormData: true,
    });
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="font-semibold">Before Photos</h3>

      {/* Upload Button */}
      <Button onClick={() => fileInputRef.current?.click()}>
        + Upload Photos
      </Button>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Preview Grid */}
      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            className="w-full h-32 object-cover rounded-md border"
          />
        ))}
      </div>
    </div>
  );
}