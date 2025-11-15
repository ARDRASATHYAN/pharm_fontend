import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";

import { useAddpurchaseinvoice, useDeletepurchaseinvoice, usepurchaseinvoice, useUpdatepurchaseinvoice } from "@/hooks/usePurchaseInvoice";
import { getPurchaseInvoiceColumns } from "./components/PurchaseInvoicesHeader";
import PurchaseInvoiceForm from "./components/PurchaseInvoicesForm";
import PurchaseForm from "../purchase/PurchaseForm";

export default function PurchaseInvoiceMockApiHeader() {
  const { data: purchaseinvoice = [], isLoading, isFetching } = usepurchaseinvoice();
  const addpurchaseinvoice = useAddpurchaseinvoice();
  const updatepurchaseinvoice = useUpdatepurchaseinvoice();
  const deletepurchaseinvoice = useDeletepurchaseinvoice();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    invoice_no: "",
    invoice_date: "",
    total_amount: "",
    total_discount: "",
    supplier_id: "",
    store_id: "",
    created_by: "",
    total_gst: "",
    net_amount: "",

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Add or Update
  const handleSubmit = () => {
    if (editMode) {
      updatepurchaseinvoice.mutate(
        { id: formData.purchase_id, data: formData },
        {

          onSuccess: () => setOpen(false),
        }
      );
    } else {
      addpurchaseinvoice.mutate(formData, {
        onSuccess: () => setOpen(false),
      });
    }
  };



  // ✏️ Edit Handler

  const handleEdit = (row) => {

    console.log("row", row);

    setFormData(row);
    setEditMode(true);
    setOpen(true);
  };

  // ❌ Delete Handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deletepurchaseinvoice.mutate(id);
    }
  };





  // ✅ pass handlers to columns (so edit/delete buttons work)
  const columns = getPurchaseInvoiceColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
          Purchase Invoice List
        </h2>
        <Button variant="contained" color="primary" onClick={() => {
          // 🧹 Clear previous data before opening
          setFormData({
            invoice_no: "",
            invoice_date: "",
            total_amount: "",
            total_discount: "",
            supplier_id: "",
            store_id: "",
            created_by: "",
            total_gst: "",
            net_amount: "",
          });
          setEditMode(false);
          setOpen(true);
        }}>
          Add PurchaseInvoice
        </Button>
      </div>


      <BasicTable columns={columns} data={purchaseinvoice} loading={isLoading || isFetching} />


      <PurchaseForm
        open={open}
        onClose={() => {
          setOpen(false);
          setEditMode(false);
        }}
        onSubmit={handleSubmit}
        formData={formData}
        onChange={handleChange}
        editMode={editMode}
      />
    </>
  );
}
