// src/components/purchase/PurchaseInvoiceMockApiHeader.jsx
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable"

import { getPurchaseReturnColumns } from "./components/PurchaseReturnHeader";
import { usePurchaseReturnList } from "@/hooks/usePurchaseReturn";


export default function PurchaseReturnMockApiHeader() {



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
  
 
  
    
  

  
 


  // 🧾 Invoice header state (formData)
  const [formData, setFormData] = useState({
    purchase_id: "",
    invoice_no: "",
    invoice_date: "",
    supplier_id: "",
    store_id: "",
    user_id: "", // we can use for display; backend uses currentUser.user_id
    total_amount: "",
    total_discount: "",
    total_gst: "",
    net_amount: "",
  });

  
  

  // ✏️ Edit Handler (for header row; items editing not wired yet)
  const handleEdit = (row) => {
    console.log("row", row);
    setFormData({
      purchase_id: row.purchase_id,
      invoice_no: row.invoice_no,
      invoice_date: row.invoice_date,
      supplier_id: row.supplier_id,
      store_id: row.store_id,
      user_id: row.created_by,
      total_amount: row.total_amount,
      total_discount: row.total_discount,
      total_gst: row.total_gst,
      net_amount: row.net_amount,
    });
    
  };

  // ❌ Delete Handler
  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this purchase invoice?")
    ) {
      // deletepurchaseinvoice.mutate(id);
    }
  };
const { data: purchasereturnData, isLoading } = usePurchaseReturnList({
  page: Number(filters.page),
  perPage: Number(filters.perPage)
});

// purchasereturnData contains both `data` and `pagination`


      const handlePageChange = (page) => setFilters(prev => ({ ...prev, page: Number(page) || 1 }));
  
  
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
          Purchase return List
        </h2>
       
      </div>
<BasicTable
  columns={getPurchaseReturnColumns(handleEdit, handleDelete)}
  data={purchasereturnData?.data || []}
  loading={isLoading}
  pagination={{
    page: purchasereturnData?.pagination?.page || 1,
    perPage: purchasereturnData?.pagination?.limit || filters.perPage,
    total: purchasereturnData?.pagination?.total || 0,
    totalPages: purchasereturnData?.pagination?.totalPages || 1,
  }}
  onPageChange={handlePageChange}
/>

    </>
  );
}
