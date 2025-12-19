// src/components/purchase/PurchaseInvoiceMockApiHeader.jsx
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { getSalesInvoiceColumns } from "./component/SalesInvoiceHeader";
import { useSaleItems, useSalesInvoiceList } from "@/hooks/useSalesInvoice";


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
 
    const { data: salesinvoice = {}, isLoading } = useSalesInvoiceList({
      search: filters.search,
      page: Number(filters.page),
      perPage: Number(filters.perPage),
    });
   
    const{data:saleitem,isLoading:itemloading}=useSaleItems(selectedInvoiceId)
    console.log(saleitem,"invoice");
  
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

        const handleItem = (id) => {
          console.log("id",id);
          
           setSelectedInvoiceId(id) 
setOpenItems(true);
        };
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
  
    const columns = getSalesInvoiceColumns(handleEdit, handleDelete,handleItem);

  
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
           Invoice No: {saleitem?.data?.[0]?.invoice?.bill_no}
        </h3>
        <Button variant="outlined" color="secondary" onClick={() => setOpenItems(false)}>
          Close
        </Button>
      </Box>

      {itemloading && <p>Loading items...</p>}

      {!itemloading && saleitem?.data?.length === 0 && <p>No items found</p>}

      {!itemloading && saleitem?.data?.length > 0 && (
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
                 
                  <th style={{ padding: "8px" }}>S-Discount</th>
                  <th style={{ padding: "8px" }}>S-Rate</th>
                  <th style={{ padding: "8px" }}>GST</th>
                  <th style={{ padding: "8px" }}>Taxable Amount</th>
                  <th style={{ padding: "8px" }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {saleitem.data.map((row, index) => (
                  <tr
                    key={row.sale_item_id || index}
                    style={{
                      background: index % 2 === 0 ? "#f5f5f5" : "#fff",
                    }}
                  >
                    <td style={{ padding: "6px" }}>{row.item?.name}</td>
                    <td style={{ padding: "6px" }}>{row.item?.hsn?.hsn_code}</td>
                    <td style={{ padding: "6px" }}>{row.batch_no}</td>
                    <td style={{ padding: "6px" }}>{row.qty}</td>
                    <td style={{ padding: "6px" }}>{row.discount_percent}%</td>
                    <td style={{ padding: "6px" }}>{row.rate}</td>
                    <td style={{ padding: "6px" }}>{row.gst_percent}%</td>
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
            <p><strong>Total Amount:</strong> {saleitem.data[0]?.invoice?.total_amount}</p>
            <p><strong>Total Discount:</strong> {saleitem.data[0]?.invoice?.total_discount}</p>
            <p><strong>Total GST:</strong> {saleitem.data[0]?.invoice?.total_gst}</p>
            <p><strong>Net Amount:</strong> {saleitem.data[0]?.invoice?.net_amount}</p>
          </Box>
        </>
      )}
    </Box>
  </Box>
)}

   
    </>
  );
}
