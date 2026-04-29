// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";

// interface StartJobPayload {
//   latitude: number | null;
//   longitude: number | null;
//   timestamp: string;
//   accuracy?: number | null;
// }

// interface StartJobButtonProps {
//   onClick: (data: StartJobPayload) => void;
//   label?: string;
//   className?: string;
// }

// export default function StartJobButton({
//   onClick,
//   label = "Start Job",
//   className = "",
// }: StartJobButtonProps) {
//   const [permissionState, setPermissionState] =
//     useState<PermissionState | "unknown">("unknown");

//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   // 🔍 Permission check (safe version)
//   useEffect(() => {
//     if (!navigator.permissions) return;

//     navigator.permissions
//       .query({ name: "geolocation" as PermissionName })
//       .then((res) => {
//         setPermissionState(res.state);

//         res.onchange = () => {
//           setPermissionState(res.state);
//         };
//       })
//       .catch(() => {
//         setPermissionState("unknown");
//       });
//   }, []);

//   const handleClick = () => {
//     const timestamp = new Date().toLocaleString();
//     setErrorMsg(null);

//     if (!navigator.geolocation) {
//       setErrorMsg("Geolocation not supported on this device.");
//       return;
//     }

//     setLoading(true);

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLoading(false);

//         onClick({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           accuracy: position.coords.accuracy,
//           timestamp,
//         });
//       },
//       (error) => {
//         setLoading(false);

//         // 🔥 REAL ERROR FEEDBACK
//         let msg = "Unable to get location.";

//         if (error.code === 1) msg = "Permission denied. Enable location in browser settings.";
//         if (error.code === 2) msg = "Location unavailable. Check device GPS.";
//         if (error.code === 3) msg = "Location request timed out.";

//         setErrorMsg(msg);

//         onClick({
//           latitude: null,
//           longitude: null,
//           timestamp,
//           accuracy: null,
//         });
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0,
//       }
//     );
//   };

//   return (
//     <div className="space-y-2 w-full">

//       {/* Permission status */}
//       {permissionState === "denied" && (
//         <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
//           Location is blocked. Enable it in browser settings.
//         </div>
//       )}

//       {permissionState === "prompt" && (
//         <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
//           Click Start Job to allow location access.
//         </div>
//       )}

//       {/* Error message */}
//       {errorMsg && (
//         <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
//           {errorMsg}
//         </div>
//       )}

//       <Button
//         className={`bg-green-600 hover:bg-green-700 text-white w-full ${className}`}
//         onClick={handleClick}
//         disabled={loading}
//       >
//         {loading ? "Getting location..." : label}
//       </Button>

//       {/* Retry button */}
//       {errorMsg && (
//         <Button
//           variant="outline"
//           className="w-full"
//           onClick={handleClick}
//         >
//           Retry Location
//         </Button>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface StartJobPayload {
  latitude: number | null;
  longitude: number | null;
  timestamp: string;
  accuracy?: number | null;
  manual?: boolean;
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
    useState<PermissionState | "unknown">("unknown");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [manualMode, setManualMode] = useState(false);

  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");

  const [lastKnown, setLastKnown] = useState<StartJobPayload | null>(null);

  // 🔍 Permission check
  useEffect(() => {
    if (!navigator.permissions) return;

    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((res) => {
        setPermissionState(res.state);
        res.onchange = () => setPermissionState(res.state);
      })
      .catch(() => setPermissionState("unknown"));
  }, []);

  const handleGeo = () => {
    const timestamp = new Date().toLocaleString();
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setErrorMsg("Geolocation not supported on this device.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);

        const data = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp,
        };

        setLastKnown(data);
        onClick(data);
      },
      (error) => {
        setLoading(false);

        let msg = "Location unavailable — check device settings.";

        if (error.code === 1) {
          msg =
            "Location blocked. Enable:\n• Location Services\n• Precise Location\n• Browser permission";
        }

        if (error.code === 2) {
          msg =
            "GPS unavailable. Turn on Location Services and try again.";
        }

        if (error.code === 3) {
          msg = "Location request timed out. Try again.";
        }

        setErrorMsg(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleManualSubmit = () => {
    const timestamp = new Date().toLocaleString();

    const data = {
      latitude: Number(manualLat),
      longitude: Number(manualLng),
      accuracy: null,
      timestamp,
      manual: true,
    };

    setLastKnown(data);
    onClick(data);
    setManualMode(false);
  };

  return (
    <div className="space-y-3 w-full">

      {/* 🔴 Permission state UI */}
      {permissionState === "denied" && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          <b>Location blocked</b><br />
          Enable:
          <ul className="list-disc ml-5 mt-1">
            <li>Location Services (device settings)</li>
            <li>Precise Location (Android/iPhone)</li>
            <li>Browser Location Permission</li>
          </ul>
        </div>
      )}

      {permissionState === "prompt" && (
        <div className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
          Tap <b>Start Job</b> to allow location access.
        </div>
      )}

      {/* ❌ Error message */}
      {errorMsg && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded whitespace-pre-line">
          {errorMsg}
        </div>
      )}

      {/* 🟢 Main button */}
      <Button
        className={`bg-green-600 hover:bg-green-700 text-white w-full ${className}`}
        onClick={handleGeo}
        disabled={loading}
      >
        {loading ? "Getting location..." : label}
      </Button>

      {/* 🔁 Retry */}
      {errorMsg && (
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGeo}
        >
          Retry GPS
        </Button>
      )}

      {/* 🟡 Manual fallback toggle */}
      {errorMsg && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setManualMode(true)}
        >
          Enter Location Manually
        </Button>
      )}

      {/* 🧭 Manual input */}
      {manualMode && (
        <div className="space-y-2 border p-3 rounded">
          <input
            className="w-full border p-2 rounded"
            placeholder="Latitude"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Longitude"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
          />

          <Button className="w-full" onClick={handleManualSubmit}>
            Submit Manual Location
          </Button>
        </div>
      )}

      {/* 📍 Last known location */}
      {lastKnown && (
        <div className="text-xs text-gray-500">
          Last location saved ✓
        </div>
      )}
    </div>
  );
}