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
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [serverPhotos, setServerPhotos] = useState(existingPhotos);

  const [isDoneSelecting, setIsDoneSelecting] = useState(false);
  const [confirmUpload, setConfirmUpload] = useState(false);

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
  // REMOVE PREVIEW
  // =============================
  const removePreview = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // =============================
  // FINAL UPLOAD
  // =============================
  const uploadPhotos = () => {
    if (photos.length === 0) return;

    const formData = new FormData();

    photos.forEach((file) => {
      formData.append("photos[]", file);
    });

    router.post(`/job-cards/${jobId}/after-photos`, formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setPhotos([]);
        setPreviews([]);
        setIsDoneSelecting(false);
        setConfirmUpload(false);

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
      <h3 className="font-semibold text-lg">After Photos</h3>

      {/* SELECT */}
      {!isDoneSelecting && !confirmUpload && (
        <Button
          variant="default"
          onClick={() => fileInputRef.current?.click()}
        >
          + Select After Photos
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

      {/* DONE SELECTING */}
      {previews.length > 0 && !isDoneSelecting && !confirmUpload && (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setIsDoneSelecting(true)}
        >
          Done Selecting Photos
        </Button>
      )}

      {/* UPLOAD + GO BACK */}
      {isDoneSelecting && !confirmUpload && (
        <div className="space-y-2">
          <Button
            variant="default"
            className="w-full"
            onClick={() => setConfirmUpload(true)}
          >
            Upload After Photos
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsDoneSelecting(false)}
          >
            Go Back
          </Button>
        </div>
      )}

      {/* CONFIRM */}
      {confirmUpload && (
        <div className="space-y-3 p-4 border rounded-md bg-muted">
          <p className="font-medium">
            Are you sure you want to upload these photos?
          </p>

          <Button
            variant="default"
            className="w-full"
            onClick={uploadPhotos}
          >
            Yes, Upload Photos
          </Button>

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setConfirmUpload(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-3 gap-3">
        {/* SERVER */}
        {serverPhotos.map((photo) => (
          <div key={photo.id} className="relative">
            <img
              src={`/storage/${photo.path}`}
              className="w-full h-32 object-cover rounded-md border"
            />

            <Button
              variant="destructive"
              size="xs"
              className="absolute top-1 right-1 px-2 py-1"
              onClick={() => deletePhoto(photo.id)}
            >
              ✕
            </Button>
          </div>
        ))}

        {/* PREVIEWS */}
        {previews.map((photo, index) => (
          <div key={`new-${index}`} className="relative">
            <img
              src={photo}
              className="w-full h-32 object-cover rounded-md border"
            />

            <Button
              variant="destructive"
              size="xs"
              className="absolute top-1 right-1 px-2 py-1"
              onClick={() => removePreview(index)}
            >
              ✕
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}