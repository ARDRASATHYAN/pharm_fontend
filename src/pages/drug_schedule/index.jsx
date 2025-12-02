import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { getDrugScheduleColumns } from "./components/DrugScheduleHeader";
import DrugScheduleForm from "./components/DrugScheduleForm";
import BasicTable from "@/components/commen/BasicTable";
import {
  useAddDrugSchedule,
  useDeleteDrugSchedule,
  useDrugSchedule,
  useUpdateDrugSchedule
} from "@/hooks/useDrugSchedule";
import {
  showErrorToast,
  showSuccessToast
} from "@/lib/toastService";
import ConfirmDialog from "@/components/commen/ConfirmDialog";

export default function DrugSchedulePage() {
  // pagination + dynamic rows
  const [filters, setFilters] = useState({ page: 1, perPage: 10 });

  // modal states
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  // delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // API CALLS
  const { data: schedulesData = {}, isLoading } = useDrugSchedule(filters);
  const addSchedule = useAddDrugSchedule();
  const updateSchedule = useUpdateDrugSchedule();
  const deleteSchedule = useDeleteDrugSchedule();

  const schedules = schedulesData?.data || [];

  // dynamic table height
  const adjustRows = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 180;
    const rowHeight = 34;

    const rows = Math.floor((screenHeight - headerHeight) / rowHeight);

    setFilters((prev) => ({
      ...prev,
      perPage: Math.max(5, rows)
    }));
  };

  useEffect(() => {
    adjustRows();
    window.addEventListener("resize", adjustRows);
    return () => window.removeEventListener("resize", adjustRows);
  }, []);

  // PAGE CLICK
  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Add / Edit Submit
  const handleSubmit = (values, resetForm) => {
    if (editMode && editingStore?.schedule_id) {
      updateSchedule.mutate(
        { id: editingStore.schedule_id, data: values },
        {
          onSuccess: () => {
            showSuccessToast("Drug Schedule updated");
            setOpen(false);
            setEditMode(false);
            setEditingStore(null);
          },
          onError: () => showErrorToast("Update failed")
        }
      );
    } else {
      addSchedule.mutate(values, {
        onSuccess: () => {
          showSuccessToast("Drug Schedule created");
          resetForm?.();
        },
        onError: () => showErrorToast("Create failed")
      });
    }
  };

  // Edit
  const handleEdit = (row) => {
    setEditingStore(row);
    setEditMode(true);
    setOpen(true);
  };

  // Delete
  const handleDelete = (id) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;

    deleteSchedule.mutate(selectedId, {
      onSuccess: () => {
        showSuccessToast("Drug Schedule deleted");
        setDeleteDialogOpen(false);
        setSelectedId(null);
      },
      onError: () => {
        showErrorToast("Delete failed");
        setDeleteDialogOpen(false);
      }
    });
  };

  // Table columns
  const columns = getDrugScheduleColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">Drug Schedule List</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpen(true);
            setEditMode(false);
            setEditingStore(null);
          }}
        >
          Add Drug Schedule
        </Button>
      </div>

      <BasicTable
        columns={columns}
        data={schedules}
        loading={isLoading}
        pagination={{
          page: schedulesData?.page || 1,
          perPage: filters.perPage,
          totalPages: schedulesData?.totalPages || 1,
          total: schedulesData?.total || 0
        }}
        onPageChange={handlePageChange}
      />

      <DrugScheduleForm
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

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Drug Schedule"
        description="Are you sure you want to delete this record?"
        confirmText="Delete"
        confirmColor="error"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedId(null);
        }}
      />
    </>
  );
}
