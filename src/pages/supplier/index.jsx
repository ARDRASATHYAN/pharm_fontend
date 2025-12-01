import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { useAddSupplier, useDeleteSupplier, useSupplier, useUpdateSupplier } from "@/hooks/useSupplier";
import SupplierForm from "./components/SupplierForm";
import { getSupplierColumns } from "./components/SupplierHeader";
import { showErrorToast, showSuccessToast } from "@/lib/toastService";
import ConfirmDialog from "@/components/commen/ConfirmDialog";

export default function SupplierMockApiHeader() {
  const { data: suppliers = {}, isLoading, isFetching } = useSupplier();
    const  supplier=suppliers.data ||[];
  const addSupplier = useAddSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [SelectedSupplierId, setSelectedSupplierId] = useState(null);

  const handleSubmit = (values, resetForm) => {
    if (editMode && editingStore?.supplier_id) {
      updateSupplier.mutate(
        { id: editingStore.supplier_id, data: values },
        {
          onSuccess: () => {
            showSuccessToast("Store updated successfully");
            setOpen(false);
            setEditMode(false);
            setEditingStore(null);
          },
          onError: (error) => {
            console.error(error);
            showErrorToast("Failed to update Store");
          },
        }
      );
    } else {
      // ADD MODE: keep dialog open but clear the fields
      addSupplier.mutate(values, {
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


  //Edit Handler
  const handleEdit = (row) => {
    console.log("row", row);
    setEditingStore(row);
    setEditMode(true);
    setOpen(true);
  };


  // Delete Handler – open confirm dialog
  const handleDelete = (id) => {
    setSelectedSupplierId(id);
    setDeleteDialogOpen(true);
  };

  //Confirm delete
  const confirmDelete = () => {
    if (!SelectedSupplierId) return;

    deleteSupplier.mutate(SelectedSupplierId, {
      onSuccess: () => {
        showSuccessToast("Store deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedSupplierId(null);
      },
      onError: (error) => {
        console.error(error);
        showErrorToast("Failed to delete Store");
        setDeleteDialogOpen(false);
      },
    });
  };

  // ✅ pass handlers to columns (so edit/delete buttons work)
  const columns = getSupplierColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
          Supplier List
        </h2>
        <Button variant="contained" color="primary" onClick={() => {
          setOpen(true);
          setEditMode(false);
          setEditingStore(null);
        }}>
          Add supplier
        </Button>
      </div>


      <BasicTable columns={columns} data={supplier} loading={isLoading} />


      <SupplierForm
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
        title="Delete Supplier"
        description="Are you sure you want to delete this Supplier? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedSupplierId(null);
        }}
      />
    </>
  );
}
