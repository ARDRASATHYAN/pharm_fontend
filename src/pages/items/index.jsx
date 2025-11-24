import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { useAdditem, useDeleteitem, useitem, useUpdateitem } from "@/hooks/useItem";
import ItemForm from "./components/ItemForm";
import { getItemsColumns } from "./components/ItemHeader";
import { showErrorToast, showSuccessToast } from "@/lib/toastService";
import ConfirmDialog from "@/components/commen/ConfirmDialog";

export default function ItemMockApiHeader() {
  const { data: item = [], isLoading ,isFetching} = useitem();
  const additem = useAdditem();
  const updateitem = useUpdateitem();
  const deleteitem = useDeleteitem();

const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [SelectedItemId, setSelectedItemId] = useState(null);


   // Add or Update 
  
  const handleSubmit = (values, resetForm) => {
    if (editMode && editingStore?.item_id) {
      updateitem.mutate(
        { id: editingStore.item_id, data: values },
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
      additem.mutate(values, {
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
      setSelectedItemId(id);
      setDeleteDialogOpen(true);
    };
  
    //Confirm delete
    const confirmDelete = () => {
      if (!SelectedItemId) return;
      console.log(SelectedItemId,"SelectedItemId");
      
  
      deleteitem.mutate(SelectedItemId, {
        onSuccess: () => {
          showSuccessToast("item deleted successfully");
          setDeleteDialogOpen(false);
          setSelectedItemId(null);
        },
        onError: (error) => {
          console.error(error);
          showErrorToast("Failed to delete item");
          setDeleteDialogOpen(false);
        },
      });
    };
  
 
  


  // ✅ pass handlers to columns (so edit/delete buttons work)
  const columns = getItemsColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
          Items List
        </h2>
        <Button variant="contained" color="primary" onClick={() => {
            setOpen(true);
            setEditMode(false);
            setEditingStore(null);
          }}>
          Add Item
        </Button>
      </div>


      <BasicTable columns={columns} data={item} loading={isLoading}/>


      <ItemForm
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
        title="Delete item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedItemId(null);
        }}
      />
    </>
  );
}
