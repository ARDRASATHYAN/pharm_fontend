// src/components/purchase/PurchaseInvoiceMockApiHeader.jsx
import React, { useState } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";

import {
  useAddpurchaseinvoice,
  useDeletepurchaseinvoice,
  usepurchaseinvoice,
  useUpdatepurchaseinvoice,
} from "@/hooks/usePurchaseInvoice";
import { getPurchaseInvoiceColumns } from "./components/PurchaseInvoicesHeader";


export default function PurchaseInvoiceMockApiHeader() {
  const { data: purchaseinvoice = [], isLoading, isFetching } =
    usepurchaseinvoice();
  
 


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
          Purchase Invoice List
        </h2>
       
      </div>

      <BasicTable
        columns={getPurchaseInvoiceColumns(handleEdit, handleDelete)}
        data={purchaseinvoice}
        loading={isLoading || isFetching}
      />

   
    </>
  );
}
