"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";



interface StartJobButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function StartJobButton({
  onClick,
  label = "Start Job",
  className = "",
  disabled = false,
}: StartJobButtonProps) {
  const [permissionState, setPermissionState] = useState<PermissionState | "unknown">("unknown");

  // Check permission only for visual feedback
  useEffect(() => {
    if (!navigator.permissions) return;

    navigator.permissions.query({ name: "geolocation" as PermissionName }).then((res) => {
        setPermissionState(res.state);
        res.onchange = () => setPermissionState(res.state);
      })
      .catch(() => setPermissionState("unknown"));
  }, []);

  return (
    <div className="space-y-3 w-full">

      {/* 🔴 Permission warnings (UI only) */}
      {permissionState === "denied" && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          <b>Location blocked</b><br />
          Enable Location Services + Browser Permission.
        </div>
      )}

      {permissionState === "prompt" && (
        <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
          Tap <b>Start Job</b> to allow location.
        </div>
      )}

      {/* 🟢 Main Start button */}
      <Button
  className={`bg-green-600 hover:bg-green-700 text-white w-full ${className}`}
  onClick={onClick}
  disabled={disabled}
>
  {label}
</Button>
    </div>
  );
}