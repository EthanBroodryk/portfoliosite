"use client";

import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

interface ExistingPhoto {
  id: number;
  path: string;
}

export default function BeforePhotosSection({
  jobId,
  existingPhotos = [],
}: {
  jobId: number;
  existingPhotos?: ExistingPhoto[];
}) {
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle file select
  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const previews: string[] = [];

    Array.from(files).forEach((file) => {
      previews.push(URL.createObjectURL(file)); // preview
    });

    setPhotos((prev) => [...prev, ...previews]);

    // Upload
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

      {/* Photos Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* 🔥 EXISTING PHOTOS (from DB) */}
        {existingPhotos.map((photo) => (
          <img
            key={photo.id}
            src={`/storage/${photo.path}`}
            className="w-full h-32 object-cover rounded-md border"
          />
        ))}

        {/* 🆕 NEWLY UPLOADED PREVIEW */}
        {photos.map((photo, index) => (
          <img
            key={`new-${index}`}
            src={photo}
            className="w-full h-32 object-cover rounded-md border"
          />
        ))}
      </div>
    </div>
  );
}