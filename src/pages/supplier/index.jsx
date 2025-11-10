import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import {  getItemsColumns } from "./components/itemHeader";
import BasicTable from "@/components/commen/BasicTable";
import { useAdditem, useDeleteitem, useitem, useUpdateitem } from "@/hooks/useItem";
import ItemForm from "./components/ItemForm";
import { useAddSupplier, useDeleteSupplier, useSupplier, useUpdateSupplier } from "@/hooks/useSupplier";

export default function SupplierMockApiHeader() {
  const { data: supplier = [], isLoading } = useSupplier();
  const addSupplier = useAddSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

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
      updateSupplier.mutate(
        { id: formData.item_id, data: formData },
        {

          onSuccess: () => setOpen(false),
        }
      );
    } else {
      addSupplier.mutate(formData, {
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
      deleteSupplier.mutate(id);
    }
  };


  if (isLoading) return <p>Loading hsns...</p>;


  // ✅ pass handlers to columns (so edit/delete buttons work)
  const columns = getItemsColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
          Drug Schedule List
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
          Add supplier
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
