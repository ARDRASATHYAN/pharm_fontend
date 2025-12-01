import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DataTable from "../../components/commen/Datatable";
import { getHsnColumns } from "./components/HsnHeader";
import HsnForm from "./components/HsnForm";
import BasicTable from "@/components/commen/BasicTable";
import { useAddHsn, useDeleteHsn, useHsn, useUpdateHsn } from "@/hooks/useHsn";
import { showErrorToast, showSuccessToast } from "@/lib/toastService";
import ConfirmDialog from "@/components/commen/ConfirmDialog";


export default function HsnMockApiHeader() {
const { data: hsnsData = {}, isLoading } = useHsn();
const hsns = hsnsData.data || [];
  const addHsn = useAddHsn();
  const updateHsn = useUpdateHsn();
  const deleteHsn = useDeleteHsn();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingStore, setEditingStore] = useState(null);


  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedHsnId, setSelectedHsnId] = useState(null);



  const handleSubmit = (values, resetForm) => {
    if (editMode && editingStore?.hsn_id) {
      updateHsn.mutate(
        { id: editingStore.hsn_id, data: values },
        {
          onSuccess: () => {
            showSuccessToast("hsn updated successfully");
            setOpen(false);
            setEditMode(false);
            setEditingStore(null);
          },
          onError: (error) => {
            console.error(error);
            showErrorToast("Failed to update hsn");
          },
        }
      );
    } else {
      // ADD MODE: keep dialog open but clear the fields
      addHsn.mutate(values, {
        onSuccess: () => {
          showSuccessToast("Store created successfully");
          if (typeof resetForm === "function") {
            resetForm(); // this clears form fields
          }
        },
        onError: (error) => {
          console.error(error);
          showErrorToast("Failed to create Store");
        },
      });
    }
  };

  // 🟢 Add or Update



  // ✏️ Edit Handler
  const handleEdit = (row) => {
    console.log("row", row);
    setEditingStore(row);
    setEditMode(true);
    setOpen(true);
  };


  // Delete Handler – open confirm dialog
  const handleDelete = (id) => {
    setSelectedHsnId(id);
    setDeleteDialogOpen(true);
  };

  //Confirm delete
  const confirmDelete = () => {
    if (!selectedHsnId) return;

    deleteHsn.mutate(selectedHsnId, {
      onSuccess: () => {
        showSuccessToast("hsn deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedHsnId(null);
      },
      onError: (error) => {
        console.error(error);
        showErrorToast("Failed to delete hsn");
        setDeleteDialogOpen(false);
      },
    });
  };







  // ✅ pass handlers to columns (so edit/delete buttons work)
  const columns = getHsnColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
          HSN List
        </h2>
        <Button variant="contained" color="primary" onClick={() => {
          // 🧹 Clear previous data before opening

          setOpen(true);
          setEditMode(false);
          setEditingStore(null);
        }}>
          Add HSN
        </Button>
      </div>


      <BasicTable columns={columns} data={hsns} loading={isLoading} />


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


      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Hsn"
        description="Are you sure you want to delete this hsn? This action cannot be undone."
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
