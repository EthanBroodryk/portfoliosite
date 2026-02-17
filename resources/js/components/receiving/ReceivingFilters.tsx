"use client";

import { Label } from "@/components/ui/label";

interface ReceivingFiltersProps {
  receiving_types: { id: number; name: string; label: string }[];
  selectedTypeId: number | null;
  setSelectedTypeId: (id: number | null) => void;
}

export default function ReceivingFilters({
  receiving_types,
  selectedTypeId,
  setSelectedTypeId,
}: ReceivingFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

      {/* Receiving Type */}
      <div>
        <Label className="text-sm">Receiving Type</Label>
        <select
          className="w-full p-2 border rounded"
          value={selectedTypeId ?? ""}
          onChange={(e) => {
            const id = Number(e.target.value) || null;
            setSelectedTypeId(id);
          }}
        >
          <option value="">Select Receiving Type</option>

          {receiving_types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
}
