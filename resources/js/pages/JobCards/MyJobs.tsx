"use client";

import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

// ========================================
// TYPES
// ========================================
interface JobCard {
  id: number;
  job_number: string;
  technician: string;
  branch_id: number | null;
  description: string;
  status: string;
  created_at: string;
}



interface InertiaSharedProps {
  errors: Record<string, any>;
  [key: string]: any;
}

interface Branch {
  id: number;
  name: string;
}

interface MyJobsProps extends InertiaSharedProps {
  jobcards: JobCard[];
  branches: Branch[];
}

// ========================================
// PAGE
// ========================================
export default function MyJobs() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Job Cards", href: "/job-cards" },
    { title: "My Jobs", href: "/job-cards/my" },
  ];



const { jobcards: initialCards = [], branches = [] } = usePage<MyJobsProps>().props;

const branchMap = Object.fromEntries(
  branches.map((b) => [b.id, b.name])
);

const [cards, setCards] = useState<JobCard[]>(initialCards ?? []);



  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<Record<string, any>>({});

  // ========================================
  // Start Editing
  // ========================================
  const handleEdit = (job: JobCard) => {
    setEditingId(job.id);
    setFormData({
      title: job.title,
      description: job.description,
      status: job.status,
    });
  };

  // ========================================
  // Save
  // ========================================
  const handleSave = (id: number) => {
    router.put(`/job-cards/${id}`, formData, {
      onSuccess: () => {
        setCards(
          cards.map((c) =>
            c.id === id ? { ...c, ...formData } : c
          )
        );
        setEditingId(null);
      },
    });
  };

  // ========================================
  // Cancel
  // ========================================
  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Job Cards" />

      <div className="p-6 md:p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">My Job Cards</h1>

        <div className="overflow-x-auto w-full">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Tech</TableHead>
                <TableHead>Branch</TableHead>  
                <TableHead>Desc</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No job cards found.
                  </TableCell>
                </TableRow>
              ) : (
                cards.map((job) => (
                  <TableRow key={job.id}>

                    {/* Job */}
                    <TableCell>
                      {job.job_number}
                    </TableCell>

                    {/* Tech */}
                    <TableCell>
                      {job.technician ?? "—"}
                    </TableCell>

                    {/* Branch */}
                   <TableCell>
                      {branchMap[job.branch_id] ?? "—"}
                    </TableCell>

                    

                    {/* Description */}
                    <TableCell className="max-w-[250px]">
                      <div
                        className="truncate whitespace-nowrap overflow-hidden text-ellipsis"
                        title={job.description}
                      >
                        {job.description}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {job.status.replace("_", " ")}
                    </TableCell>

                    {/* Created */}
                    <TableCell>
                      {new Date(job.created_at).toLocaleString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        onClick={() => router.visit(`/job-cards/${job.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}