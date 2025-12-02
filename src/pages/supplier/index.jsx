import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { useAddSupplier, useDeleteSupplier, useSupplier, useUpdateSupplier } from "@/hooks/useSupplier";
import SupplierForm from "./components/SupplierForm";
import { getSupplierColumns } from "./components/SupplierHeader";
import { showErrorToast, showSuccessToast } from "@/lib/toastService";
import ConfirmDialog from "@/components/commen/ConfirmDialog";

export default function SupplierMockApiHeader() {
  const [filters, setFilters] = useState({ page: 1, perPage: 10, search: "" });

  const { data: suppliersData = {}, isLoading } = useSupplier(filters);
  const suppliers = suppliersData?.data || [];
  const totalPages = Math.ceil((suppliersData?.total || 0) / filters.perPage);

  const addSupplier = useAddSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  const handleSubmit = (values, resetForm) => {
    if (editMode && editingSupplier?.supplier_id) {
      updateSupplier.mutate({ id: editingSupplier.supplier_id, data: values }, {
        onSuccess: () => { setOpen(false); setEditMode(false); setEditingSupplier(null); },
        onError: () => showErrorToast("Update failed"),
      });
    } else {
      addSupplier.mutate(values, {
        onSuccess: () => resetForm?.(),
        onError: () => showErrorToast("Create failed"),
      });
    }
  };

  const handleEdit = (row) => { setEditingSupplier(row); setEditMode(true); setOpen(true); };
  const handleDelete = (id) => { setSelectedSupplierId(id); setDeleteDialogOpen(true); };
  const confirmDelete = () => {
    if (!selectedSupplierId) return;
    deleteSupplier.mutate(selectedSupplierId, {
      onSuccess: () => { setDeleteDialogOpen(false); setSelectedSupplierId(null); },
      onError: () => { showErrorToast("Delete failed"); setDeleteDialogOpen(false); },
    });
  };

  const handlePageChange = (page) => setFilters(prev => ({ ...prev, page }));
  const handlePerPageChange = (perPage) => setFilters(prev => ({ ...prev, perPage, page: 1 }));

  const columns = getSupplierColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">Supplier List</h2>
        <Button variant="contained" color="primary" onClick={() => { setOpen(true); setEditMode(false); setEditingSupplier(null); }}>
          Add Supplier
        </Button>
      </div>

      <BasicTable
        columns={columns}
        data={suppliers}
        loading={isLoading}
        pagination={{
          page: suppliersData?.page || 1,
          perPage: filters.perPage,
          totalPages,
          total: suppliersData?.total || 0,
        }}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />

      <SupplierForm
        open={open}
        onClose={() => { setOpen(false); setEditMode(false); setEditingSupplier(null); }}
        onSubmit={handleSubmit}
        defaultValues={editingSupplier}
        editMode={editMode}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Supplier"
        description="Are you sure you want to delete this Supplier? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => { setDeleteDialogOpen(false); setSelectedSupplierId(null); }}
      />
    </>
  );
}

