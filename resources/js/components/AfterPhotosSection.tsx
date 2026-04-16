"use client";

import { useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

interface ExistingPhoto {
  id: number;
  path: string;
}

export default function AfterPhotosSection({
  jobId,
  existingPhotos = [],
}: {
  jobId: number;
  existingPhotos?: ExistingPhoto[];
}) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [serverPhotos, setServerPhotos] = useState(existingPhotos);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const previews: string[] = [];

    Array.from(files).forEach((file) => {
      previews.push(URL.createObjectURL(file));
    });

    setPhotos((prev) => [...prev, ...previews]);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("photos[]", file);
    });

    router.post(`/job-cards/${jobId}/after-photos`, formData, {
      forceFormData: true,
      preserveScroll: true,
    });
  };

  const deletePhoto = (id: number) => {
    setServerPhotos((prev) => prev.filter((p) => p.id !== id));

    router.delete(`/job-cards/photos/${id}`, {
      preserveScroll: true,
    });
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="font-semibold">After Photos</h3>

      <Button onClick={() => fileInputRef.current?.click()}>
        + Upload After Photos
      </Button>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="grid grid-cols-3 gap-3">
        {serverPhotos.map((photo) => (
          <div key={photo.id} className="relative">
            <img
              src={`/storage/${photo.path}`}
              className="w-full h-32 object-cover rounded-md border"
            />
            <button
              onClick={() => deletePhoto(photo.id)}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}

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