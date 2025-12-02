import React, { useState, useLayoutEffect, useEffect } from "react";
import { Box, Button } from "@mui/material";
import UserForm from "./components/UserForm";
import { getUserColumns } from "./components/Userheader";
import BasicTable from "@/components/commen/BasicTable";
import { useAddUser, useDeleteUser, useUpdateUser, useUsers } from "@/hooks/useUsers";
import UserFilter from "./components/UserFilter";
import { showErrorToast, showSuccessToast } from "@/lib/toastService";
import ConfirmDialog from "@/components/commen/ConfirmDialog";

export default function User() {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    is_active: "",
    page: 1,
    perPage: 10,
  });

  // Dynamically calculate perPage based on screen height
  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 180; // filters + table header
    const rowHeight = 34;      // height of a single row
    const rows = Math.floor((screenHeight - headerHeight) / rowHeight);
    const safeRows = Math.max(5, rows); // minimum 5 rows
    setFilters(prev => ({ ...prev, perPage: safeRows, page: 1 }));
  };

  useLayoutEffect(() => {
    adjustRowsByHeight();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", adjustRowsByHeight);
    return () => window.removeEventListener("resize", adjustRowsByHeight);
  }, []);

  // Fetch users with proper numeric page/perPage
  const { data, isLoading } = useUsers({
    ...filters,
    page: Number(filters.page) || 1,
    perPage: Number(filters.perPage) || 10,
  });

  const addUser = useAddUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  // Add / Update
  const handleSubmit = (payload) => {
    if (editMode && editingUser?.user_id) {
      updateUser.mutate(
        { id: editingUser.user_id, data: payload },
        {
          onSuccess: () => { showSuccessToast("User updated"); setOpen(false); setEditMode(false); },
          onError: () => showErrorToast("Failed to update user"),
        }
      );
    } else {
      addUser.mutate(payload, {
        onSuccess: () => showSuccessToast("User created"),
        onError: () => showErrorToast("Failed to create user"),
      });
    }
  };

  const handleEdit = (row) => { setEditingUser(row); setEditMode(true); setOpen(true); };
  const handleDelete = (id) => { setSelectedUserId(id); setDeleteDialogOpen(true); };
  const confirmDelete = () => {
    if (!selectedUserId) return;
    deleteUser.mutate(selectedUserId, {
      onSuccess: () => { showSuccessToast("Deleted"); setDeleteDialogOpen(false); setSelectedUserId(null); },
      onError: () => { showErrorToast("Delete failed"); setDeleteDialogOpen(false); },
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page: Number(page) || 1 }));
  };

  const columns = getUserColumns(handleEdit, handleDelete);

  return (
    <>
      <h2 className="text-xl font-bold text-blue-700 tracking-wide p-0">User List</h2>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <UserFilter filters={filters} onFilterChange={handleFilterChange} searchOnly />
        <Box display="flex" gap={2} alignItems="center">
          <UserFilter filters={filters} onFilterChange={handleFilterChange} />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => { setOpen(true); setEditMode(false); setEditingUser(null); }}
          >
            Add User
          </Button>
        </Box>
      </Box>

      <BasicTable
        columns={columns}
        data={data?.users || []}
        loading={isLoading}
        pagination={{
          page: data?.page || 1,
          perPage: filters.perPage,
          totalPages: data?.totalPages || 1,
          total: data?.total || 0,
        }}
        onPageChange={handlePageChange}
      />

      <UserForm
        open={open}
        onClose={() => { setOpen(false); setEditMode(false); setEditingUser(null); }}
        onSubmit={handleSubmit}
        defaultValues={editingUser}
        editMode={editMode}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => { setDeleteDialogOpen(false); setSelectedUserId(null); }}
      />
    </>
  );
}
