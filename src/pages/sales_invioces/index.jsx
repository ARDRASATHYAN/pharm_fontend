// src/components/purchase/PurchaseInvoiceMockApiHeader.jsx
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { getSalesInvoiceColumns } from "./component/SalesInvoiceHeader";
import { useSalesInvoiceList } from "@/hooks/useSalesInvoice";


export default function SalesInvoiceMockApiHeader() {
  // const { data: salesinvoice = [], isLoading, isFetching } =useSalesInvoiceList()
    
  
 


  // 🧾 Invoice header state (formData)
  // const [formData, setFormData] = useState({
  //   purchase_id: "",
  //   invoice_no: "",
  //   invoice_date: "",
  //   supplier_id: "",
  //   store_id: "",
  //   user_id: "", // we can use for display; backend uses currentUser.user_id
  //   total_amount: "",
  //   total_discount: "",
  //   total_gst: "",
  //   net_amount: "",
  // });

  
  

  // ✏️ Edit Handler (for header row; items editing not wired yet)
  // const handleEdit = (row) => {
  //   console.log("row", row);
  //   setFormData({
  //     purchase_id: row.purchase_id,
  //     invoice_no: row.invoice_no,
  //     invoice_date: row.invoice_date,
  //     supplier_id: row.supplier_id,
  //     store_id: row.store_id,
  //     user_id: row.created_by,
  //     total_amount: row.total_amount,
  //     total_discount: row.total_discount,
  //     total_gst: row.total_gst,
  //     net_amount: row.net_amount,
  //   });
    
  // };

  // ❌ Delete Handler
  // const handleDelete = (id) => {
  //   if (
  //     window.confirm("Are you sure you want to delete this purchase invoice?")
  //   ) {
  //     // deletepurchaseinvoice.mutate(id);
  //   }
  // };





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
 
    const { data: salesinvoice = {}, isLoading } = useSalesInvoiceList({
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
  
    const columns = getSalesInvoiceColumns(handleEdit, handleDelete);

  
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
          Sales Invoice List
        </h2>
       
      </div>
s
  <BasicTable
        columns={columns}
        data={salesinvoice?.data || []}
        loading={isLoading}
        pagination={{
          page: salesinvoice?.page || 1,
          perPage: filters.perPage,
          totalPages: salesinvoice?.totalPages || 1,
          total: salesinvoice?.total || 0,
        }}
        rowPadding="py-2" 
        onPageChange={handlePageChange}
      />
   
    </>
  );
}
