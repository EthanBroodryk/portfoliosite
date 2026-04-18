"use client";

import React, { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { type BreadcrumbItem } from "@/types";
import BranchForm from "@/components/branch/BranchForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Branch {
  id: number;
  name: string;
  location: string;
}

export default function ManageBranches() {
  const { branches } = usePage<{ branches: Branch[] }>().props;

  const [open, setOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    location: "",
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Admin", href: "/pos/sales" },
    { title: "Manage Branches", href: "/admin/branches" },
  ];

  function submit() {
  if (editingBranch) {
    router.post(
      `/admin/branches/${editingBranch}`,
      {
        _method: "put",
        name: form.name,
        location: form.location,
        logo: form.logo, // <-- MUST be File or null
      },
      {
        forceFormData: true,
        onSuccess: () => {
          setOpen(false);
          setEditingBranch(null);
          setForm({ name: "", location: "", logo: null });
        }
      }
    );
  } else {
    router.post(
      `/admin/branches/store`,
      form,
      {
        forceFormData: true,
        onSuccess: () => {
          setOpen(false);
          setForm({ name: "", location: "", logo: null });
        }
      }
    );
  }
}

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin - Manage Branches" />

      <div className="p-6 md:p-8 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Branches</h2>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>{editingBranch ? "Edit Branch" : "Add Branch"}</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingBranch ? "Edit Branch" : "Add New Branch"}
                </DialogTitle>
              </DialogHeader>

                <BranchForm form={form} setForm={setForm} />

              <DialogFooter>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setOpen(false);
                    setEditingBranch(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={submit}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto w-full">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {branches && branches.length > 0 ? (
                branches.map((branch) => (
                  <TableRow key={branch.id}>
                    <TableCell>{branch.id}</TableCell>
                    <TableCell>{branch.name}</TableCell>
                    <TableCell>{branch.location}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setForm({
                            name: branch.name,
                            location: branch.location,
                          });
                          setEditingBranch(branch.id);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-4 text-gray-500"
                  >
                    No branches found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
}
