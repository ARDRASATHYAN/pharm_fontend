import React, { useState, useLayoutEffect, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { getPurchaseInvoiceColumns } from "./components/PurchaseInvoicesHeader";
import ConfirmDialog from "@/components/commen/ConfirmDialog";
import { showSuccessToast, showErrorToast } from "@/lib/toastService";
import { usepurchaseinvoice } from "@/hooks/usePurchaseInvoice";

export default function AllPurchaseInvoices() {
  // ----------------------------
  // Modal / Edit state
  // ----------------------------
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  // ----------------------------
  // Delete state
  // ----------------------------
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  // ----------------------------
  // Filters / Pagination / Search
  // ----------------------------
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    perPage: 10,
  });

  // Dynamically calculate perPage based on screen height
  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 180; // filters + table header
    const rowHeight = 34;
    const rows = Math.floor((screenHeight - headerHeight) / rowHeight);
    setFilters(prev => ({ ...prev, perPage: Math.max(5, rows), page: 1 }));
  };

  useLayoutEffect(() => {
    adjustRowsByHeight();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", adjustRowsByHeight);
    return () => window.removeEventListener("resize", adjustRowsByHeight);
  }, []);

  // Fetch purchase invoices
  const { data: purchaseData = {}, isLoading } = usepurchaseinvoice({
    search: filters.search,
    page: Number(filters.page),
    perPage: Number(filters.perPage),
  });

  // const addInvoice = useAddPurchaseInvoice();
  // const updateInvoice = useUpdatePurchaseInvoice();
  // const deleteInvoice = useDeletePurchaseInvoice();

  // ----------------------------
  // Add / Update
  // ----------------------------
  const handleSubmit = (payload) => {
    if (editMode && editingInvoice?.purchase_id) {
      updateInvoice.mutate(
        { id: editingInvoice.purchase_id, data: payload },
        {
          onSuccess: () => { showSuccessToast("Invoice updated"); setOpenForm(false); setEditMode(false); },
          onError: () => showErrorToast("Failed to update invoice"),
        }
      );
    } else {
      addInvoice.mutate(payload, {
        onSuccess: () => { showSuccessToast("Invoice created"); setOpenForm(false); },
        onError: () => showErrorToast("Failed to create invoice"),
      });
    }
  };

  // ----------------------------
  // Edit
  // ----------------------------
  const handleEdit = (invoice) => { setEditingInvoice(invoice); setEditMode(true); setOpenForm(true); };

  // ----------------------------
  // Delete
  // ----------------------------
  const handleDelete = (id) => { setSelectedInvoiceId(id); setDeleteDialogOpen(true); };
  const confirmDelete = () => {
    if (!selectedInvoiceId) return;
    deleteInvoice.mutate(selectedInvoiceId, {
      onSuccess: () => { showSuccessToast("Deleted"); setDeleteDialogOpen(false); setSelectedInvoiceId(null); },
      onError: () => { showErrorToast("Delete failed"); setDeleteDialogOpen(false); },
    });
  };

  // ----------------------------
  // Filters & search
  // ----------------------------
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };
  const handlePageChange = (page) => setFilters(prev => ({ ...prev, page: Number(page) || 1 }));

  const columns = getPurchaseInvoiceColumns(handleEdit, handleDelete);

  return (
    <>
      <h2 className="text-xl font-bold text-blue-700 tracking-wide mb-2">Purchase Invoices</h2>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          size="small"
          placeholder="Search by invoice, supplier..."
          value={filters.search}
          onChange={handleSearchChange}
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => { setOpenForm(true); setEditMode(false); setEditingInvoice(null); }}
        >
          Add Invoice
        </Button>
      </Box>

      <BasicTable
        columns={columns}
        data={purchaseData?.data || []}
        loading={isLoading}
        pagination={{
          page: purchaseData?.page || 1,
          perPage: filters.perPage,
          totalPages: purchaseData?.totalPages || 1,
          total: purchaseData?.total || 0,
        }}
        rowPadding="py-2" 
        onPageChange={handlePageChange}
      />

    

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Purchase Invoice"
        description="Are you sure you want to delete this purchase invoice? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        onConfirm={confirmDelete}
        onCancel={() => { setDeleteDialogOpen(false); setSelectedInvoiceId(null); }}
      />
    </>
  );
}
