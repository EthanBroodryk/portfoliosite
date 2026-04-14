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
  title: string;
  description: string;
  status: string;
  created_at: string;
}

interface InertiaSharedProps {
  errors: Record<string, any>;
  [key: string]: any;
}

interface MyJobsProps extends InertiaSharedProps {
  jobcards: JobCard[];
}

// ========================================
// PAGE
// ========================================
export default function MyJobs() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Job Cards", href: "/job-cards" },
    { title: "My Jobs", href: "/job-cards/my" },
  ];

const { jobcards: initialCards = [] } = usePage<MyJobsProps>().props;

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
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {cards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No job cards found.
                  </TableCell>
                </TableRow>
              ) : (
                cards.map((job) => (
                  <TableRow key={job.id}>
                    {/* Title */}
                    <TableCell>
                      {editingId === job.id ? (
                        <Input
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                        />
                      ) : (
                        job.title
                      )}
                    </TableCell>

                    {/* Description */}
                    <TableCell>
                      {editingId === job.id ? (
                        <Input
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                        />
                      ) : (
                        job.description
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {editingId === job.id ? (
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            setFormData({ ...formData, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        job.status.replace("_", " ")
                      )}
                    </TableCell>

                    {/* Created At */}
                    <TableCell>
                      {new Date(job.created_at).toLocaleString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right space-x-2">
                      {editingId === job.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSave(job.id)}
                          >
                            Save
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(job)}
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              router.delete(`/job-cards/${job.id}`)
                            }
                          >
                            Delete
                          </Button>
                        </>
                      )}
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