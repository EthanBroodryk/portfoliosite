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
  description: string;
  status: string;
  created_at: string;
}

interface SharedProps {
  jobcards: JobCard[];
}

export default function AllJobCards() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Job Cards", href: "/job-cards" },
    { title: "All Jobs", href: "/job-cards/all" },
  ];

  const { jobcards: initialCards = [] } = usePage<SharedProps>().props;
  const [cards, setCards] = useState<JobCard[]>(initialCards);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="All Job Cards" />

      <div className="p-6 md:p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">All Job Cards</h1>

        {/* ============================
            SEARCH + FILTERS
        ============================ */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by job number or technician..."
            className="md:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value)}
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

        {/* ============================
            TABLE
        ============================ */}
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
              {filteredCards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No job cards found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCards.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.job_number}</TableCell>
                    <TableCell>{job.technician}</TableCell>
                    <TableCell>{job.description}</TableCell>
                    <TableCell>{job.status.replace("_", " ")}</TableCell>

                    <TableCell>
                      {new Date(job.created_at).toLocaleString()}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        onClick={() => router.visit(`/job-cards/${job.id}`)}
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
      </div>
    </AppLayout>
  );
}