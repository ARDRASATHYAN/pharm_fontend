import React, { useState, useLayoutEffect, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { getPurchaseInvoiceColumns } from "./components/PurchaseInvoicesHeader";
import ConfirmDialog from "@/components/commen/ConfirmDialog";
import { showSuccessToast, showErrorToast } from "@/lib/toastService";
import { usepurchaseinvoice, usePurchaseItemsByPurchaseId } from "@/hooks/usePurchaseInvoice";

export default function AllPurchaseInvoices() {
  // ----------------------------
  // Modal / Edit state
  // ----------------------------
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [openItems, setOpenItems] = useState(false);


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


  const {
  data: purchaseItems,
  isLoading:itemloading,
  error,
} = usePurchaseItemsByPurchaseId(selectedInvoiceId);
console.log(purchaseItems,"invoice");


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


  const handleItem=(id)=>{
    setSelectedInvoiceId(id)
    setOpenItems(true);
    
  }

  // ----------------------------
  // Filters & search
  // ----------------------------
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };
  const handlePageChange = (page) => setFilters(prev => ({ ...prev, page: Number(page) || 1 }));

  const columns = getPurchaseInvoiceColumns(handleEdit, handleDelete,handleItem);

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
        rowPadding="py-1" 
        onPageChange={handlePageChange}
      />


{openItems && (
  <Box
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1300,
      overflowY: "auto",
      p: 2,
    }}
  >
    <Box
      sx={{
        background: "#fff",
        p: 4,
        width: "100%",
        maxWidth: 1200,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }} className="font-bold">
           Invoice No: {purchaseItems?.data?.[0]?.purchaseInvoice?.invoice_no}
        </h3>
        <Button variant="outlined" color="secondary" onClick={() => setOpenItems(false)}>
          Close
        </Button>
      </Box>

      {itemloading && <p>Loading items...</p>}

      {!itemloading && purchaseItems?.data?.length === 0 && <p>No items found</p>}

      {!itemloading && purchaseItems?.data?.length > 0 && (
        <>
          {/* Table */}
          <Box sx={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              <thead>
                <tr style={{ background: "#1976d2", color: "#fff", position: "sticky", top: 0 }}>
                  <th style={{ padding: "8px" }}>Item</th>
                  <th style={{ padding: "8px" }}>HSN</th>
                  <th style={{ padding: "8px" }}>Batch</th>
                  <th style={{ padding: "8px" }}>QTY</th>
                  <th style={{ padding: "8px" }}>Free</th>
                  <th style={{ padding: "8px" }}>MRP</th>
                  <th style={{ padding: "8px" }}>P-Rate</th>
                  <th style={{ padding: "8px" }}>S-Discount</th>
                  <th style={{ padding: "8px" }}>S-Rate</th>
                  <th style={{ padding: "8px" }}>GST</th>
                  <th style={{ padding: "8px" }}>CGST</th>
                  <th style={{ padding: "8px" }}>SGST</th>
                  <th style={{ padding: "8px" }}>Taxable Amount</th>
                  <th style={{ padding: "8px" }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {purchaseItems.data.map((row, index) => (
                  <tr
                    key={row.purchase_item_id || index}
                    style={{
                      background: index % 2 === 0 ? "#f5f5f5" : "#fff",
                    }}
                  >
                    <td style={{ padding: "6px" }}>{row.item?.name}</td>
                    <td style={{ padding: "6px" }}>{row.item?.hsn?.hsn_code}</td>
                    <td style={{ padding: "6px" }}>{row.batch_no}</td>
                    <td style={{ padding: "6px" }}>{row.qty}</td>
                    <td style={{ padding: "6px" }}>{row.free_qty}</td>
                    <td style={{ padding: "6px" }}>{row.mrp}</td>
                    <td style={{ padding: "6px" }}>{row.purchase_rate}</td>
                    <td style={{ padding: "6px" }}>{row.discount_percent}%</td>
                    <td style={{ padding: "6px" }}>{row.sale_rate}</td>
                    <td style={{ padding: "6px" }}>{row.gst_percent}%</td>
                    <td style={{ padding: "6px" }}>{row.cgst}</td>
                     <td style={{ padding: "6px" }}>{row.sgst}</td>
                    <td style={{ padding: "6px" }}>{row.taxable_amount}</td>
                    <td style={{ padding: "6px" }}>{row.total_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          {/* Totals */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
              gap: 1,
              background: "#f0f0f0",
              p: 2,
              borderRadius: 1,
            }}
          >
            <p><strong>Total Amount:</strong> {purchaseItems.data[0]?.purchaseInvoice?.total_amount}</p>
            <p><strong>Total Discount:</strong> {purchaseItems.data[0]?.purchaseInvoice?.total_discount}</p>
            <p><strong>Total GST:</strong> {purchaseItems.data[0]?.purchaseInvoice?.total_gst}</p>
            <p><strong>Net Amount:</strong> {purchaseItems.data[0]?.purchaseInvoice?.net_amount}</p>
          </Box>
        </>
      )}
    </Box>
  </Box>
)}



    

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
