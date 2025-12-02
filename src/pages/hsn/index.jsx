import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { useHsn, useAddHsn, useUpdateHsn, useDeleteHsn } from "@/hooks/useHsn";
import { getHsnColumns } from "./components/HsnHeader";
import HsnForm from "./components/HsnForm";
import ConfirmDialog from "@/components/commen/ConfirmDialog";
import { showSuccessToast, showErrorToast } from "@/lib/toastService";

export default function HsnPage() {
  // pagination + dynamic row size
  const [filters, setFilters] = useState({ page: 1, perPage: 10 });

  // modal states
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  // delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHsnId, setSelectedHsnId] = useState(null);

  // API
  const { data: hsnsData = {}, isLoading } = useHsn(filters);
  const addHsn = useAddHsn();
  const updateHsn = useUpdateHsn();
  const deleteHsn = useDeleteHsn();

  const hsns = hsnsData?.data || []; // MUST match backend "data"

  // Adjust table rows based on screen size
  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 180;
    const rowHeight = 34;

    const rows = Math.floor((screenHeight - headerHeight) / rowHeight);

    setFilters((prev) => ({
      ...prev,
      perPage: Math.max(5, rows),
    }));
  };

  useEffect(() => {
    adjustRowsByHeight();
    window.addEventListener("resize", adjustRowsByHeight);
    return () => window.removeEventListener("resize", adjustRowsByHeight);
  }, []);

  // ----------------------
  // Pagination Click
  // ----------------------
  const handlePageChange = (page) =>
    setFilters((prev) => ({ ...prev, page }));

  // ----------------------
  // Add / Update HSN
  // ----------------------
  const handleSubmit = (values, resetForm) => {
    // EDIT
    if (editMode && editingStore?.hsn_id) {
      updateHsn.mutate(
        { id: editingStore.hsn_id, data: values },
        {
          onSuccess: () => {
            showSuccessToast("HSN updated successfully");
            setOpen(false);
            setEditMode(false);
            setEditingStore(null);
          },
          onError: () => showErrorToast("Update failed"),
        }
      );
    }
    // ADD
    else {
      addHsn.mutate(values, {
        onSuccess: () => {
          showSuccessToast("HSN created");
          resetForm?.();
        },
        onError: () => showErrorToast("Create failed"),
      });
    }
  };

  // ----------------------
  // Edit
  // ----------------------
  const handleEdit = (row) => {
    setEditingStore(row);
    setEditMode(true);
    setOpen(true);
  };

  // ----------------------
  // Delete Flow
  // ----------------------
  const handleDelete = (id) => {
    setSelectedHsnId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedHsnId) return;

    deleteHsn.mutate(selectedHsnId, {
      onSuccess: () => {
        showSuccessToast("HSN deleted");
        setDeleteDialogOpen(false);
        setSelectedHsnId(null);
      },
      onError: () => {
        showErrorToast("Delete failed");
        setDeleteDialogOpen(false);
      },
    });
  };

  // Table Columns
  const columns = getHsnColumns(handleEdit, handleDelete);
  console.log("HSN LIST:", hsns);
  console.log("HSN RESPONSE:", hsnsData);

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">HSN List</h2>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpen(true);
            setEditMode(false);
            setEditingStore(null);
          }}
        >
          Add HSN
        </Button>
      </div>

      {/* Table */}
      <BasicTable
        columns={columns}
        data={hsns}
        loading={isLoading}
        pagination={{
          page: hsnsData?.page || 1,
          perPage: filters.perPage,
          totalPages: hsnsData?.totalPages || 1,
          total: hsnsData?.total || 0,
        }}
        onPageChange={handlePageChange}
      />

      {/* Add/Edit Form */}
      <HsnForm
        open={open}
        onClose={() => {
          setOpen(false);
          setEditMode(false);
          setEditingStore(null);
        }}
        onSubmit={handleSubmit}
        defaultValues={editingStore}
        editMode={editMode}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete HSN"
        description="Are you sure you want to delete this HSN?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedHsnId(null);
        }}
      />
    </>
  );
}
