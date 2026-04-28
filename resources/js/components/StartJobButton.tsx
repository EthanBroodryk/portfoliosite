"use client";

import { Button } from "@/components/ui/button";

interface StartJobPayload {
  latitude: number | null;
  longitude: number | null;
  timestamp: string;
  accuracy?: number | null;
}

interface StartJobButtonProps {
  onClick: (data: StartJobPayload) => void;
  label?: string;
  className?: string;
}

export default function StartJobButton({
  onClick,
  label = "Start Job",
  className = "",
}: StartJobButtonProps) {
  const handleClick = () => {
    const timestamp = new Date().toISOString();

    if (!navigator.geolocation) {
      onClick({
        latitude: null,
        longitude: null,
        timestamp,
        accuracy: null,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onClick({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp,
        });
      },
      () => {
        // user denied or error
        onClick({
          latitude: null,
          longitude: null,
          timestamp,
          accuracy: null,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  return (
    <Button
      className={`bg-green-600 hover:bg-green-700 text-white w-full ${className}`}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}