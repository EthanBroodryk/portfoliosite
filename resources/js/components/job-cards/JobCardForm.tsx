"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Technician {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

interface JobCard {
  id: number;
  job_number: string;
  technician: string;
  description: string;
  status: string;
  created_at: string;
}

export default function JobCardForm({
  form,
  setForm,
  technicians,
  branches,
}: {
  form: JobCard;
  setForm: (data: JobCard) => void;
  technicians: Technician[];
  branches: Branch[];
}) {
  return (
    <div className="space-y-3">
      <Input
        value={form.job_number}
        placeholder="Job Number"
        onChange={(e) =>
          setForm({ ...form, job_number: e.target.value })
        }
      />

      {/* Technician dropdown */}
      <Select
        value={form.technician}
        onValueChange={(value) =>
          setForm({ ...form, technician: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Technician" />
        </SelectTrigger>

        <SelectContent>
          {technicians.map((tech) => (
            <SelectItem key={tech.id} value={tech.name}>
              {tech.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Branch dropdown */}
      <Select
        value={(form as any).branch_id}
        onValueChange={(value) =>
          setForm({ ...(form as any), branch_id: Number(value) })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Branch" />
        </SelectTrigger>

        <SelectContent>
          {branches.map((b) => (
            <SelectItem key={b.id} value={String(b.id)}>
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        value={form.description}
        placeholder="Description"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <Select
        value={form.status}
        onValueChange={(value) =>
          setForm({ ...form, status: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}