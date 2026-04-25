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
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [serverPhotos, setServerPhotos] = useState(existingPhotos);

  const [isDoneSelecting, setIsDoneSelecting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // =============================
  // HANDLE FILE SELECT
  // =============================
  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);

    setPhotos((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // =============================
  // REMOVE PREVIEW (🔥 FIX)
  // =============================
  const removePreview = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // =============================
  // UPLOAD
  // =============================
  const uploadPhotos = () => {
    if (photos.length === 0) return;

    const formData = new FormData();

    photos.forEach((file) => {
      formData.append("photos[]", file);
    });

    router.post(`/job-cards/${jobId}/before-photos`, formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setPhotos([]);
        setPreviews([]);
        setIsDoneSelecting(false);

        router.reload({ only: ["job"] });
      },
    });
  };

  // =============================
  // DELETE SERVER PHOTO
  // =============================
  const deletePhoto = (id: number) => {
    setServerPhotos((prev) => prev.filter((p) => p.id !== id));

    router.delete(`/job-cards/photos/${id}`, {
      preserveScroll: true,
    });
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="font-semibold">Before Photos</h3>

      {/* SELECT */}
      {!isDoneSelecting && (
        <Button onClick={() => fileInputRef.current?.click()}>
          + Select Photos
        </Button>
      )}

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* DONE */}
      {previews.length > 0 && !isDoneSelecting && (
        <Button
          className="w-full bg-green-600 text-white"
          onClick={() => setIsDoneSelecting(true)}
        >
          Done Selecting Photos
        </Button>
      )}

      {/* UPLOAD */}
      {isDoneSelecting && (
        <Button
          className="w-full bg-blue-600 text-white"
          onClick={uploadPhotos}
        >
          Upload Before Photos
        </Button>
      )}

      {/* GRID */}
      <div className="grid grid-cols-3 gap-3">
        {/* SERVER PHOTOS */}
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

        {/* PREVIEWS (🔥 NOW WITH DELETE) */}
        {previews.map((photo, index) => (
          <div key={`new-${index}`} className="relative">
            <img
              src={photo}
              className="w-full h-32 object-cover rounded-md border"
            />

            {/* ❌ DELETE PREVIEW */}
            <button
              onClick={() => removePreview(index)}
              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}