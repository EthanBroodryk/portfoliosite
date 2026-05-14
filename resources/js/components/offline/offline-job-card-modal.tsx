import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { saveJobCards } from "@/utils/indexedDbJobCards";

export default function OfflineJobCardModal({ card, onClose }) {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<any>(card?.location || null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported on this device.");
      return;
    }

    setLoading(true);
        navigator.geolocation.getCurrentPosition(
        async (pos) => {
            const locationData = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            timestamp: new Date().toISOString(),
            };

            setCoords(locationData);

            await saveJobCards([{ ...card, location: locationData }]);

            setLoading(false);
        },
        (err) => {
            console.error("Geolocation error", err);
            alert("Could not get location: " + err.message);
            setLoading(false);
        },
        {
            enableHighAccuracy: true,
            timeout: 80000,
            maximumAge: 0,
        }
        );
  };

  return (
    <Dialog open={!!card} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Job Card Details</DialogTitle>
          <DialogDescription>
            More information about the selected offline job card.
          </DialogDescription>
        </DialogHeader>

        {card && (
          <div className="space-y-3">
            <p>
              <strong>ID:</strong> {card.id}
            </p>

            <p>
              <strong>Client:</strong> {card.client || "N/A"}
            </p>

            <p>
              <strong>Status:</strong> {card.status}
            </p>

            <p>
              <strong>Date:</strong> {card.created_at}
            </p>

            {/* Show location if available */}
            {coords && (
              <div className="p-2 border rounded">
                <p className="font-semibold">Saved Location:</p>
                <p>Lat: {coords.lat}</p>
                <p>Lng: {coords.lng}</p>
                <p className="text-xs text-gray-500">{coords.timestamp}</p>
              </div>
            )}

            <Button onClick={handleGetLocation} disabled={loading}>
              {loading ? "Getting location..." : "Get Location"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}