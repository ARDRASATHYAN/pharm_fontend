// src/pages/store/index.jsx (or StoreMockApiHeader.jsx)
import React, { useState } from "react";
import { Button } from "@mui/material";
import StoreForm from "./components/StoreForm";
import { getStoreColumns } from "./components/StoreHeader";
import BasicTable from "@/components/commen/BasicTable";
import {
  useAddStore,
  useDeleteStore,
  useStores,
  useUpdateStore,
} from "@/hooks/useStore";
import { showSuccessToast } from "@/lib/toastService";
import ConfirmDialog from "@/components/commen/ConfirmDialog";

export default function StoreMockApiHeader() {
  const { data: stores = [], isLoading } = useStores();
  const addStore = useAddStore();
  const updateStore = useUpdateStore();
  const deleteStore = useDeleteStore();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedStoreId, setSelectedStoreId] = useState(null);

  // Add or Update 
  const handleSubmit = (values) => {
    if (editMode && editingStore?.store_id) {
      updateStore.mutate(
        { id: editingStore.store_id, data: values },
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
      addStore.mutate(values, {
        onSuccess: () => {
          showSuccessToast("Store created successfully");
          resolve(true);
        },
        onError: (error) => {
          console.error(error);
          showErrorToast("Failed to create user");
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
     setSelectedStoreId(id);
     setDeleteDialogOpen(true);
   };
 
   //Confirm delete
   const confirmDelete = () => {
     if (!selectedStoreId) return;
 
     deleteStore.mutate(selectedStoreId, {
       onSuccess: () => {
         showSuccessToast("Store deleted successfully");
         setDeleteDialogOpen(false);
         setSelectedStoreId(null);
       },
       onError: (error) => {
         console.error(error);
         showErrorToast("Failed to delete Store");
         setDeleteDialogOpen(false);
       },
     });
   };
 

  const columns = getStoreColumns(handleEdit, handleDelete);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
          Store List
        </h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpen(true);
            setEditMode(false);
            setEditingStore(null);
          }}
        >
          Add Store
        </Button>
      </div>

      {/* table */}
      <BasicTable
        columns={columns}
        data={stores}
        loading={isLoading}
      />

      {/* Add / Edit Store dialog */}
      <StoreForm
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
        title="Delete User"
        description="Are you sure you want to delete this Store? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedStoreId(null);
        }}
      />
    </>
  );
}
