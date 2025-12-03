import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import ItemForm from "./components/ItemForm";
import { getItemsColumns } from "./components/ItemHeader";
import ConfirmDialog from "@/components/commen/ConfirmDialog";
import { showSuccessToast, showErrorToast } from "@/lib/toastService";
import { useItem, useAdditem, useUpdateitem, useDeleteitem } from "@/hooks/useItem";
import HsnForm from "../hsn/components/HsnForm";
import { useAddHsn } from "@/hooks/useHsn";
import DrugScheduleForm from "../drug_schedule/components/DrugScheduleForm";
import { useAddDrugSchedule } from "@/hooks/useDrugSchedule";


export default function ItemPage() {
  // ----------------------------
  // Filters / Pagination / Search
  // ----------------------------
  const [filters, setFilters] = useState({ page: 1, perPage: 10, search: "" });

  const { data: itemsData = {}, isLoading } = useItem(filters);
  const items = Array.isArray(itemsData?.data) ? itemsData.data : [];
  const totalPages = Math.ceil((itemsData?.total || 0) / filters.perPage);

  const additem = useAdditem();
  const updateitem = useUpdateitem();
  const deleteitem = useDeleteitem();

  // ----------------------------
  // Modal states
  // ----------------------------
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // ----------------------------
  // Delete dialog
  // ----------------------------
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // hsn
  const [openHsnForm, setOpenHsnForm] = useState(false);
const handleOpenHsnForm = () => setOpenHsnForm(true);
const handleCloseHsnForm = () => setOpenHsnForm(false);

// drugschedule
 const [openDrugScheduleForm, setOpenDrugScheduleForm] = useState(false);
const handleOpenDrugScheduleForm = () => setOpenDrugScheduleForm(true);
const handleCloseDrugScheduleForm = () => setOpenDrugScheduleForm(false);


  // ----------------------------
  // Adjust table rows by screen height
  // ----------------------------
  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 180;
    const rowHeight = 34;
    const rows = Math.floor((screenHeight - headerHeight) / rowHeight);
    setFilters((prev) => ({ ...prev, perPage: Math.max(5, rows) }));
  };

  useEffect(() => {
    adjustRowsByHeight();
    window.addEventListener("resize", adjustRowsByHeight);
    return () => window.removeEventListener("resize", adjustRowsByHeight);
  }, []);

  // ----------------------------
  // Pagination / Filters
  // ----------------------------
  const handlePageChange = (page) => setFilters((prev) => ({ ...prev, page }));
  const handlePerPageChange = (perPage) => setFilters((prev) => ({ ...prev, perPage, page: 1 }));
  const handleSearchChange = (e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));

  // ----------------------------
  // Add / Update Item
  // ----------------------------
  const handleSubmit = (values, resetForm) => {
    if (editMode && editingItem?.item_id) {
      updateitem.mutate(
        { id: editingItem.item_id, data: values },
        {
          onSuccess: () => {
            showSuccessToast("Item updated successfully");
            setOpen(false);
            setEditMode(false);
            setEditingItem(null);
          },
          onError: () => showErrorToast("Update failed"),
        }
      );
    } else {
      additem.mutate(values, {
        onSuccess: () => {
          showSuccessToast("Item created successfully");
          resetForm?.();
        },
        onError: () => showErrorToast("Create failed"),
      });
    }
  };

  // ----------------------------
  // Edit
  // ----------------------------
  const handleEdit = (row) => {
    setEditingItem(row);
    setEditMode(true);
    setOpen(true);
  };

  // ----------------------------
  // Delete
  // ----------------------------
  const handleDelete = (id) => {
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedItemId) return;
    deleteitem.mutate(selectedItemId, {
      onSuccess: () => {
        showSuccessToast("Item deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedItemId(null);
      },
      onError: () => {
        showErrorToast("Delete failed");
        setDeleteDialogOpen(false);
      },
    });
  };
  const addHsn = useAddHsn();
  const handleSaveHsn = async (values) => {
 addHsn.mutate(values, {
    onSuccess: () => {
      showSuccessToast("HSN created");    
    },
  });
};



 const addDrugSchedule = useAddDrugSchedule();
  const handleSaveDrugSchedule = async (values) => {
 addDrugSchedule.mutate(values, {
    onSuccess: () => {
      showSuccessToast("drug schedule created");    
    },
  });
};

  // ----------------------------
  // Table columns
  // ----------------------------
  const columns = getItemsColumns(handleEdit, handleDelete);

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">Items List</h2>
        <div style={{ display: "flex", gap: 10 }}>
          <TextField
            size="small"
            placeholder="Search by name or SKU"
            value={filters.search}
            onChange={handleSearchChange}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpen(true);
              setEditMode(false);
              setEditingItem(null);
            }}
          >
            Add Item
          </Button>
        </div>
      </div>

      {/* Table */}
      <BasicTable
        columns={columns}
        data={items}
        loading={isLoading}
        pagination={{
          page: itemsData?.page || 1,
          perPage: filters.perPage,
          totalPages,
          total: itemsData?.total || 0,
        }}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />

      {/* Add/Edit Form */}
      <ItemForm
        open={open}
        onClose={() => {
          setOpen(false);
          setEditMode(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        defaultValues={editingItem}
        editMode={editMode}
         onOpenHsnForm={handleOpenHsnForm}
         onOpenDrugScheduleForm={handleOpenDrugScheduleForm} 
      />
      <HsnForm
  open={openHsnForm}         
  onClose={handleCloseHsnForm}
   onSubmit={handleSaveHsn}
  editMode={false}          
/>

 <DrugScheduleForm
  open={openDrugScheduleForm}         
  onClose={handleCloseDrugScheduleForm}
  onSubmit={handleSaveDrugSchedule}
  editMode={false}          
/>


      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Item"
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
