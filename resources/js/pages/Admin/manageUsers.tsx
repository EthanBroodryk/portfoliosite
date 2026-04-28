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
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ========================================
// PAGE PROPS (MUST HAVE INDEX SIGNATURE)
// ========================================
interface Branch {
  id: number;
  name: string;
}

interface UserType {
  id: number;
  name: string;
  email: string;
  branch_id: number | null;
  user_role: string;
  branch?: Branch;
}

interface InertiaSharedProps {
  errors: Record<string, any>;
  [key: string]: any; // <-- FIX: REQUIRED
}

interface ManageUsersPageProps extends InertiaSharedProps {
  users: UserType[];
  branches: Branch[];
}

export default function ManageUsers() {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Admin", href: "/admin/users" },
    { title: "Manage Users", href: "/admin/users" },
  ];

  const { users: initialUsers, branches } =
    usePage<ManageUsersPageProps>().props;

  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { auth } = usePage().props;
  const canEditRoles = auth?.user?.user_role === "super_user";
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ========================================
  // Add User Modal
  // ========================================

  const [showAddModal, setShowAddModal] = useState(false);


  const [createForm, setCreateForm] = useState({
  name: "",
  email: "",
  branch_id: "",   // good
  user_role: "",
  password: "",
});


const handleCreateUser = () => {
  const newErrors: Record<string, string> = {};

  // Name
  if (!createForm.name.trim()) {
    newErrors.name = "Name is required";
  } else if (createForm.name.length > 255) {
    newErrors.name = "Max 255 characters";
  }

  // Email
  if (!createForm.email) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(createForm.email)) {
    newErrors.email = "Invalid email";
  }

  // Password
  if (!createForm.password) {
    newErrors.password = "Password is required";
  } else if (createForm.password.length < 6) {
    newErrors.password = "Minimum 6 characters";
  }

  // Role
  if (!createForm.user_role) {
    newErrors.user_role = "Role is required";
  }

  // If errors exist → stop
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});

  router.post(
    "/admin/users",
    {
      ...createForm,
      branch_id: createForm.branch_id
        ? Number(createForm.branch_id)
        : null,
    },
    {
      onSuccess: (page) => {
        // 👇 IMPORTANT PART (no reload)
        const newUser = page.props.users?.slice(-1)[0]; // fallback

        if (newUser) {
          setUsers((prev) => [...prev, newUser]);
        }

        setShowAddModal(false);

        setCreateForm({
          name: "",
          email: "",
          branch_id: "",
          user_role: "",
          password: "",
        });
      },
    }
  );
};

  // ========================================
  // Delete User
  // ========================================
  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    router.delete(`/admin/users/${id}`, {
      onSuccess: () => {
        setUsers(users.filter((u) => u.id !== id));
      },
    });
  };

  // ========================================
  // Start Editing
  // ========================================
  const handleEdit = (user: UserType) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      branch_id: user.branch_id ?? "",
      user_role: user.user_role ?? "technician",
    });
  };

  // ========================================
  // Cancel Editing
  // ========================================
  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  // ========================================
  // Save User
  // ========================================
  const handleSave = (id: number) => {
    router.put(`/admin/users/${id}`, formData, {
      onSuccess: () => {
        const updated = users.map((u) =>
          u.id === id ? { ...u, ...formData } : u
        );
        setUsers(updated);
        setEditingId(null);
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Admin - Manage Users" />

      <div className="p-6 md:p-8 rounded-xl shadow-sm">
        <div className="flex justify-end mb-4">
         <Button onClick={() => setShowAddModal(true)}>
            Add User
          </Button>
        </div>

        <div className="overflow-x-auto w-full">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>User Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    {/* ---------------- Name ---------------- */}
                    <TableCell>
                      {editingId === user.id ? (
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        user.name
                      )}
                    </TableCell>

                    {/* ---------------- Email ---------------- */}
                    <TableCell>
                      {editingId === user.id ? (
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: e.target.value,
                            })
                          }
                        />
                      ) : (
                        user.email
                      )}
                    </TableCell>

                    {/* ---------------- Branch ---------------- */}
                    <TableCell>
                      {editingId === user.id ? (
                        <Select
                          value={formData.branch_id?.toString()}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              branch_id: Number(value),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent>
                            {branches.map((b) => (
                              <SelectItem key={b.id} value={b.id.toString()}>
                                {b.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        user.branch?.name ?? "N/A"
                      )}
                    </TableCell>

                    {/* ---------------- User Role ---------------- */}
                     <TableCell>
                      {editingId === user.id ? (
                        <Select
                          disabled={
                            !canEditRoles || auth?.user?.id === user.id // super_user cannot edit itself
                          }
                          value={formData.user_role}
                          onValueChange={(value) =>
                            setFormData({ ...formData, user_role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="super_user">Super User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="technician">Technician</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        user.user_role
                      )}
                    </TableCell>
                    {/* ---------------- Actions ---------------- */}
                    <TableCell className="text-right space-x-2">
                      {editingId === user.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSave(user.id)}
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
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(user.id)}
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

     {showAddModal && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        
        <div className="w-full max-w-md p-6 rounded-lg shadow-lg space-y-4 
                        bg-background border border-border text-foreground">

          <h2 className="text-xl font-bold">
            Add User
          </h2>
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          {/* Name */}
          <Input
            placeholder="Name"
            className="bg-background"
            value={createForm.name}
            onChange={(e) =>
              setCreateForm({ ...createForm, name: e.target.value })
            }
          />
        

          {/* Email */}
          <Input
            placeholder="Email"
            className="bg-background"
            autoComplete="email"
            value={createForm.email}
            onChange={(e) =>
              setCreateForm({ ...createForm, email: e.target.value })
            }
          />
       

          {/* Password */}
          <Input
            type="password"
            placeholder="Password"
            className="bg-background"
            value={createForm.password}
            autoComplete="new-password"
            onChange={(e) =>
              setCreateForm({ ...createForm, password: e.target.value })
            }
          />
         

          {/* Branch */}
          <Select
            value={createForm.branch_id}
            onValueChange={(value) =>
              setCreateForm({ ...createForm, branch_id: value })
            }
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>

            <SelectContent className="bg-background border border-border">
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id.toString()}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      

          {/* Role */}
          <Select
            value={createForm.user_role}
            onValueChange={(value) =>
            setCreateForm({ ...createForm, user_role: value })
            }
            >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent className="bg-background border border-border">
              {/* <SelectItem value="super_user">Super User</SelectItem> */}
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="technician">Technician</SelectItem>
            </SelectContent>
          </Select>
        
          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleCreateUser}>
              Save User
            </Button>
          </div>

        </div>
      </div>
    )}


    </AppLayout>
  );
}
