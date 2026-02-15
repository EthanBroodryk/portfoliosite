"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ReceivingFiltersProps {
  receiving_types: any[];
  branches: any[];
  users: any[];
  selectedTypeId: number | null;
  setSelectedTypeId: (id: number | null) => void;
}

export default function ReceivingFilters({
  receiving_types,
  branches,
  users,
  selectedTypeId,
  setSelectedTypeId,
}: ReceivingFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">

      {/* Receiving Type */}
      <div>
        <Label className="text-sm">Receiving Type</Label>
        <select
          className="w-full p-2 border rounded"
          value={selectedTypeId ?? ""}
          onChange={(e) => {
            const id = Number(e.target.value) || null;
            setSelectedTypeId(id);

            // DEBUG
            const selected = receiving_types.find(t => t.id === id);
            console.log("Selected ID:", id);
            console.log("selectedTypeObj:", selected);
            console.log("selectedTypeObj.name:", selected?.name);
          }}
        >
          <option value="">All</option>
          {receiving_types.map((type: any) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Branch Filter */}
      <div>
        <Label className="text-sm">Branch</Label>
        <select className="w-full p-2 border rounded">
          <option value="">All</option>
          {branches.map((b: any) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* User Filter */}
      <div>
        <Label className="text-sm">User</Label>
        <select className="w-full p-2 border rounded">
          <option value="">All</option>
          {users.map((u: any) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      {/* Date From */}
      <div>
        <Label className="text-sm">Date From</Label>
        <Input type="date" className="w-full" />
      </div>

      {/* Date To */}
      <div>
        <Label className="text-sm">Date To</Label>
        <Input type="date" className="w-full" />
      </div>

    </div>
  );
}
