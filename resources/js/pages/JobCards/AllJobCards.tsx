"use client";

import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";
import JobCardEditModal from "@/components/job-cards/JobCardEditModal";
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

// ======================
// TYPES
// ======================
interface JobCard {
  id: number;
  job_number: string;
  technician: string;
  branch_id?: number;
  description: string;
  status: string;
  created_at: string;
}

interface Technician {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

interface SharedProps {
  jobcards: JobCard[];
  technicians: Technician[];
  branches: Branch[];
}

// ======================
// FORM COMPONENT
// ======================
function JobCardForm({
  form,
  setForm,
  technicians,
  branches,
}: {
  form: any;
  setForm: (data: any) => void;
  technicians: Technician[];
  branches: Branch[];
}) {
  return (
    <div className="space-y-3">
      <Input
        value={form.job_number || ""}
        placeholder="Job Number"
        onChange={(e) =>
          setForm({ ...form, job_number: e.target.value })
        }
      />

      {/* TECHNICIAN DROPDOWN */}
      <Select
        value={form.technician || ""}
        onValueChange={(value) =>
          setForm({ ...form, technician: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Technician" />
        </SelectTrigger>
        <SelectContent>
          {technicians.map((t) => (
            <SelectItem key={t.id} value={t.name}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* BRANCH DROPDOWN */}
      <Select
        value={form.branch_id?.toString() || ""}
        onValueChange={(value) =>
          setForm({ ...form, branch_id: Number(value) })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Branch" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((b) => (
            <SelectItem key={b.id} value={b.id.toString()}>
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        value={form.description || ""}
        placeholder="Description"
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <Select
        value={form.status || "pending"}
        onValueChange={(value) =>
          setForm({ ...form, status: value })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="Return Job">Return Job</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ======================
// PAGE
// ======================
export default function AllJobCards() {
  const { jobcards = [], technicians = [], branches = [] } = usePage<SharedProps>().props;
  const [cards, setCards] = useState<JobCard[]>(jobcards);
  const [open, setOpen] = useState(false);
  const [editingJobCard, setEditingJobCard] = useState<any>(null);
// filter states
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTechnician, setFilterTechnician] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Job Cards", href: "/job-cards" },
    { title: "All Jobs", href: "/job-cards/all" },
  ];

  // FILTER
 const filtered = cards.filter((c) => {
  const matchSearch =
    c.job_number.toLowerCase().includes(search.toLowerCase()) ||
    c.technician.toLowerCase().includes(search.toLowerCase());

  const matchStatus =
    filterStatus === "all" ? true : c.status === filterStatus;

  const matchTechnician =
    filterTechnician === "all"
      ? true
      : c.technician === filterTechnician;

  return matchSearch && matchStatus && matchTechnician;
});

  const totalPages = Math.ceil(filtered.length / perPage);

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const handleEdit = (job: JobCard) => {
    setEditingJobCard(job);
    setOpen(true);
  };

  const submit = () => {
    if (!editingJobCard) return;

    router.put(`/job-cards/${editingJobCard.id}`, editingJobCard, {
      preserveScroll: true,
      onSuccess: () => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === editingJobCard.id ? editingJobCard : c
          )
        );
        setOpen(false);
        setEditingJobCard(null);
      },
    });
  };



  // delete 
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobCard | null>(null);

  const handleDeleteClick = (job: JobCard) => {
  setJobToDelete(job);
  setDeleteOpen(true);
};

  const confirmDelete = () => {
    if (!jobToDelete) return;

    router.delete(`/job-cards/${jobToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setCards((prev) =>
          prev.filter((c) => c.id !== jobToDelete.id)
        );
        setDeleteOpen(false);
        setJobToDelete(null);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="All Job Cards" />

      <div className="p-6">

        {/* MODAL */}
        <JobCardEditModal
          open={open}
          setOpen={setOpen}
          job={editingJobCard}
          setJob={setEditingJobCard}
          onSave={submit}
          technicians={technicians}
          branches={branches}
        />
        {/* SEARCH */}
        <div className="flex gap-4 mb-4">
            {/* DATE FILTER */}
        <div className="relative w-40">
          <label className="absolute -top-2 left-2 bg-white text-xs px-1 text-muted-foreground">
            From Date
          </label>

          <Input
            type="date"
            className="h-9"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="relative w-40">
          <label className="absolute -top-2 left-2 bg-white text-xs px-1 text-muted-foreground">
            To Date
          </label>

          <Input
            type="date"
            className="h-9"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
          />
        </div>

          {/* tech  filter  */}
          <Select
              value={filterTechnician}
              onValueChange={(v) => {
                setFilterTechnician(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter Technician" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Techs</SelectItem>

                {technicians.map((t) => (
                  <SelectItem key={t.id} value={t.name}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          {/* status filter */}
          <Select
            value={filterStatus}
            onValueChange={(v) => {
              setFilterStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status</SelectItem>
              <SelectItem value="return job">Return Job</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ROWS */}
        <div className="flex justify-end mb-3">
          <Select
            value={String(perPage)}
            onValueChange={(v) => {
              setPerPage(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
          {/* Dialog */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="max-w-sm">

            <DialogHeader>
              <DialogTitle>Delete Job Card</DialogTitle>
            </DialogHeader>

            <div className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
              {jobToDelete?.job_number}
              </span>
              ? This action cannot be undone.
            </div>

            <DialogFooter className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteOpen(false)}
                >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={confirmDelete}
                >
                Delete
              </Button>
            </DialogFooter>

          </DialogContent>
        </Dialog>

        {/* TABLE */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Tech</TableHead>
              <TableHead>Branch</TableHead>  
              <TableHead>Desc</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.job_number}</TableCell>
                <TableCell>{job.technician}</TableCell>
                <TableCell>{branches.find(b => b.id === job.branch_id)?.name ?? "—"}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>{job.status}</TableCell>
                <TableCell>
                  {new Date(job.created_at).toLocaleString()}
                </TableCell>

             <TableCell className="space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(job)}
              >
                Edit
              </Button>

              {/* <Button
                size="sm"
                onClick={() => router.visit(`/job-cards/${job.id}`)}
              >
                View
              </Button> */}
              <Button
                  size="sm"
                  onClick={() => router.visit(`/job-cards/${job.id}/print`)}
                >
                  View
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteClick(job)}
                >
                  Delete
                </Button>
            </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>



        {/* PAGINATION */}
        <div className="flex gap-2 mt-4 justify-center">
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>

          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "outline"}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>

      </div>
    </AppLayout>
  );
}