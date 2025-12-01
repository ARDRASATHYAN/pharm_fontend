import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { getDrugScheduleColumns } from "./components/DrugScheduleHeader";
import DrugScheduleForm from "./components/DrugScheduleForm";
import BasicTable from "@/components/commen/BasicTable";
import { useAddDrugSchedule, useDeleteDrugSchedule, useDrugSchedule, useUpdateDrugSchedule } from "@/hooks/useDrugSchedule";
import { showErrorToast, showSuccessToast } from "@/lib/toastService";
import ConfirmDialog from "@/components/commen/ConfirmDialog";

export default function DrugScheduleMockApiHeader() {
  const { data: drugschedules = {}, isLoading, isFetching } = useDrugSchedule();
  const drugschedule = drugschedules.data || [];
  const addDrugSchedule = useAddDrugSchedule();
  const updateDrugSchedule = useUpdateDrugSchedule();
  const deleteDrugSchedule = useDeleteDrugSchedule();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [SelectedDrugScheduleId, setSelectedDrugScheduleId] = useState(null);



  const handleSubmit = (values, resetForm) => {
    if (editMode && editingStore?.schedule_id) {
      updateDrugSchedule.mutate(
        { id: editingStore.schedule_id, data: values },
        {
          onSuccess: () => {
            showSuccessToast("Drug schedule updated successfully");
            setOpen(false);
            setEditMode(false);
            setEditingStore(null);
          },
          onError: (error) => {
            console.error(error);
            showErrorToast("Failed to update Drug schedule");
          },
        }
      );
    } else {
      // ADD MODE: keep dialog open but clear the fields
      addDrugSchedule.mutate(values, {
        onSuccess: () => {
          showSuccessToast("Drug schedule created successfully");
          if (typeof resetForm === "function") {
            resetForm(); // this clears form fields
          }
        },
        onError: (error) => {
          console.error(error);
          showErrorToast("Failed to create Drug schedule");
        },
      });
    }
  };



  const handleEdit = (row) => {
    console.log("row", row);
    setEditingStore(row);
    setEditMode(true);
    setOpen(true);
  };


  // Delete Handler – open confirm dialog
  const handleDelete = (id) => {
    setSelectedDrugScheduleId(id);
    setDeleteDialogOpen(true);
  };

  //Confirm delete
  const confirmDelete = () => {
    if (!SelectedDrugScheduleId) return;

    deleteDrugSchedule.mutate(SelectedDrugScheduleId, {
      onSuccess: () => {
        showSuccessToast("Store deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedDrugScheduleId(null);
      },
      onError: (error) => {
        console.error(error);
        showErrorToast("Failed to delete Store");
        setDeleteDialogOpen(false);
      },
    });
  };









  // ✅ pass handlers to columns (so edit/delete buttons work)
  const columns = getDrugScheduleColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
          Drug Schedule List
        </h2>
        <Button variant="contained" color="primary" onClick={() => {
          setOpen(true);
          setEditMode(false);
          setEditingStore(null);
        }}>
          Add Drug Schedule
        </Button>
      </div>


      <BasicTable columns={columns} data={drugschedule} loading={isLoading} />


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

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete drug Schedule"
        description="Are you sure you want to delete this drug Schedule? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedDrugScheduleId(null);
        }}
      />
    </>
  );
}
