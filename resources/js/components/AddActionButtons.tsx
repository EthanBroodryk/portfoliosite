"use client";

import { Button } from "@/components/ui/button";

export default function AddActionButtons({
  onAddPhotos,
  onOpenJob,
}: {
  onAddPhotos: () => void;
  onOpenJob: () => void;
}) {
  return (
    <div className="flex gap-3">
      <Button onClick={onAddPhotos}>
        + Add Before Photos
      </Button>

      <Button variant="outline" onClick={onOpenJob}>
        + Open Job Card
      </Button>
    </div>
  );
}