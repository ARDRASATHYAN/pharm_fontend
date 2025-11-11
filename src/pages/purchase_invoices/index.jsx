import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { useAdditem, useDeleteitem, useitem, useUpdateitem } from "@/hooks/useItem";
import ItemForm from "./components/ItemForm";
import { getItemsColumns } from "./components/ItemHeader";
import { useAddpurchaseinvoice, useDeletepurchaseinvoice, usepurchaseinvoice, useUpdatepurchaseinvoice } from "@/hooks/usePurchaseInvoice";
import { getPurchaseInvoiceColumns } from "./components/PurchaseInvoicesHeader";

export default function PurchaseInvoiceMockApiHeader() {
  const { data: purchaseinvoice = [], isLoading } = usepurchaseinvoice();
  const addpurchaseinvoice = useAddpurchaseinvoice();
  const updatepurchaseinvoice= useUpdatepurchaseinvoice();
  const deletepurchaseinvoice = useDeletepurchaseinvoice();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    sku: "",
      barcode: "",
      name: "",
      brand: "",
      generic_name: "",
      manufacturer: "",
      hsn_id: "",
      schedule_id: "",
      description: "",
      item_type: "",
      pack_size: "",
      is_active: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Add or Update
  const handleSubmit = () => {
    if (editMode) {
      updatepurchaseinvoice.mutate(
        { id: formData.item_id, data: formData },
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


  if (isLoading) return <p>Loading hsns...</p>;


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
      sku: "",
      barcode: "",
      name: "",
      brand: "",
      generic_name: "",
      manufacturer: "",
      hsn_id: "",
      schedule_id: "",
      description: "",
      item_type: "",
      pack_size: "",
      is_active: true,
    });
    setEditMode(false);
    setOpen(true);
  }}>
          Add PurchaseInvoice
        </Button>
      </div>


      <BasicTable columns={columns} data={item} />


      <ItemForm
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
