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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  description: string;
  status: string;
  created_at: string;
}

interface SharedProps {
  jobcards: JobCard[];
}

// ========================================
// FORM COMPONENT
// ========================================
function JobCardForm({
  form,
  setForm,
}: {
  form: JobCard;
  setForm: (data: JobCard) => void;
}) {
  return (
    <div className="space-y-3">
      <Input
        value={form.job_number}
        placeholder="Job Number"
        onChange={(e) => setForm({ ...form, job_number: e.target.value })}
      />

      <Input
        value={form.technician}
        placeholder="Technician"
        onChange={(e) => setForm({ ...form, technician: e.target.value })}
      />

      <Input
        value={form.description}
        placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <Select
        value={form.status}
        onValueChange={(value) => setForm({ ...form, status: value })}
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

export default function AllJobCards() {
  const [open, setOpen] = useState(false);
  const [editingJobCard, setEditingJobCard] = useState<JobCard | null>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Job Cards", href: "/job-cards" },
    { title: "All Jobs", href: "/job-cards/all" },
  ];

  const { jobcards: initialCards = [] } = usePage<SharedProps>().props;
  const [cards, setCards] = useState<JobCard[]>(initialCards);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // ✅ Pagination State
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // ============================
  // FILTERED JOBS
  // ============================
  const filteredCards = cards.filter((c) => {
    const matchesSearch =
      c.job_number.toLowerCase().includes(search.toLowerCase()) ||
      c.technician.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ? true : c.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // ============================
  // PAGINATION LOGIC
  // ============================
  const totalPages = Math.ceil(filteredCards.length / perPage);

  const paginatedCards = filteredCards.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  // ============================
  // EDIT HANDLER
  // ============================
  const handleEdit = (job: JobCard) => {
    setEditingJobCard(job);
    setOpen(true);
  };

  // ============================
  // SAVE EDITED JOB CARD
  // ============================
  const submit = () => {
    if (!editingJobCard) return;

    router.put(`/job-cards/${editingJobCard.id}`, editingJobCard, {
      preserveScroll: true,
      onSuccess: () => {
        setCards((prev) =>
          prev.map((item) =>
            item.id === editingJobCard.id ? editingJobCard : item
          )
        );
        setOpen(false);
        setEditingJobCard(null);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="All Job Cards" />

      <div className="p-6 md:p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">All Job Cards</h1>

        {/* EDIT MODAL */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Job Card</DialogTitle>
            </DialogHeader>

            {editingJobCard && (
              <JobCardForm
                form={editingJobCard}
                setForm={(data) => setEditingJobCard(data)}
              />
            )}

            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => {
                  setOpen(false);
                  setEditingJobCard(null);
                }}
              >
                Cancel
              </Button>

              <Button onClick={submit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* SEARCH + FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Search..."
            className="md:w-1/3"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="md:w-56">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ✅ ROWS PER PAGE */}
        <div className="flex justify-end mb-4">
          <Select
            value={String(perPage)}
            onValueChange={(value) => {
              setPerPage(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="5">5 rows</SelectItem>
              <SelectItem value="10">10 rows</SelectItem>
              <SelectItem value="20">20 rows</SelectItem>
              <SelectItem value="50">50 rows</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>Job Number</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedCards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No job cards found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCards.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.job_number}</TableCell>
                    <TableCell>{job.technician}</TableCell>
                    <TableCell>{job.description}</TableCell>
                    <TableCell>{job.status.replace("_", " ")}</TableCell>
                    <TableCell>
                      {new Date(job.created_at).toLocaleString()}
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(job)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => router.visit(`/job-cards/${job.id}/print`)}
                      >
                        View
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          router.delete(`/job-cards/${job.id}`, {
                            onSuccess: () =>
                              setCards(cards.filter((c) => c.id !== job.id)),
                          })
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "outline"}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}