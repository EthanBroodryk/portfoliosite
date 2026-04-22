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

// ======================
// TYPES
// ======================
interface JobCard {
  id: number;
  job_number: string;
  technician: string;
  branch_id: number | null;
  description: string;
  status: string;
  created_at: string;
}

interface Branch {
  id: number;
  name: string;
}

interface MyJobsProps {
  jobcards: JobCard[];
  branches: Branch[];
}

// ======================
// PAGE
// ======================
export default function MyJobs() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Job Cards", href: "/job-cards" },
    { title: "My Jobs", href: "/job-cards/my" },
  ];

  const { jobcards: initialCards = [], branches = [] } =
    usePage<MyJobsProps>().props;

  // ======================
  // STATE (ONLY ONCE)
  // ======================
  const [cards, setCards] = useState<JobCard[]>(initialCards ?? []);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTechnician, setFilterTechnician] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const branchMap = Object.fromEntries(
    branches.map((b) => [b.id, b.name])
  );

  // ======================
  // FILTERS (AFTER STATE)
  // ======================
  const filtered = cards.filter((c) => {
    const branchName = branchMap[c.branch_id ?? 0] ?? "";

    const matchSearch =
      c.job_number.toLowerCase().includes(search.toLowerCase()) ||
      c.technician.toLowerCase().includes(search.toLowerCase()) ||
      branchName.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      filterStatus === "all" ? true : c.status === filterStatus;

    const matchTechnician =
      filterTechnician === "all"
        ? true
        : c.technician === filterTechnician;

    const jobDate = new Date(c.created_at);

    const matchFrom = dateFrom
      ? jobDate >= new Date(dateFrom)
      : true;

    const matchTo = dateTo
      ? jobDate <= new Date(dateTo + "T23:59:59")
      : true;

    return (
      matchSearch &&
      matchStatus &&
      matchTechnician &&
      matchFrom &&
      matchTo
    );
  });

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="My Job Cards" />

      <div className="p-6 md:p-8 rounded-xl shadow-sm">
        <h1 className="text-2xl font-semibold mb-4">My Job Cards</h1>

        {/* FILTER BAR */}
        <div className="grid gap-3 sm:flex sm:flex-wrap mb-4">

          {/* SEARCH */}
          <Input
            placeholder="Search job / tech / branch"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-9 w-full sm:w-60"
          />

          {/* FROM DATE */}
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="h-9 w-full sm:w-40"
          />

          {/* TO DATE */}
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="h-9 w-full sm:w-40"
          />

          {/* TECH FILTER */}
          <Select
            value={filterTechnician}
            onValueChange={(v) => {
              setFilterTechnician(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-48">
              <SelectValue placeholder="Technician" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Techs</SelectItem>
              {[...new Set(cards.map(c => c.technician))].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* STATUS FILTER */}
          <Select
            value={filterStatus}
            onValueChange={(v) => {
              setFilterStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="return job">Return Job</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

        </div>

        {/* TABLE */}
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
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No job cards found.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.job_number}</TableCell>
                  <TableCell>{job.technician}</TableCell>
                  <TableCell>{branchMap[job.branch_id ?? 0] ?? "—"}</TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {job.description}
                  </TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell>
                    {new Date(job.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
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
    </AppLayout>
  );
}