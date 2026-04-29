"use client";

import { useEffect, useState } from "react";
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
  const [permissionState, setPermissionState] =
    useState<PermissionState | null>(null);

  const [loading, setLoading] = useState(false);

  // 🔍 Check permission status on load
  useEffect(() => {
    if (!navigator.permissions) return;

    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((res) => {
        setPermissionState(res.state);

        res.onchange = () => {
          setPermissionState(res.state);
        };
      });
  }, []);

  const handleClick = () => {
    const timestamp = new Date().toLocaleString();

    if (!navigator.geolocation) {
      onClick({
        latitude: null,
        longitude: null,
        timestamp,
        accuracy: null,
      });
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);

        onClick({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp,
        });
      },
      (error) => {
        setLoading(false);

        console.log("Geo error:", error);

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
    <div className="space-y-2 w-full">
      {/* 🚨 Permission warning UI */}
      {permissionState === "denied" && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          Location is blocked. Please enable it in your browser settings.
        </div>
      )}

      {permissionState === "prompt" && (
        <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
          This job requires location access. You will be asked when you click.
        </div>
      )}

      <Button
        className={`bg-green-600 hover:bg-green-700 text-white w-full ${className}`}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Getting location..." : label}
      </Button>
    </div>
  );
}