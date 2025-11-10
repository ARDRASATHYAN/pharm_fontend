import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import {  getItemsColumns } from "./components/itemHeader";
import BasicTable from "@/components/commen/BasicTable";
import { useAdditem, useDeleteitem, useitem, useUpdateitem } from "@/hooks/useItem";
import ItemForm from "./components/ItemForm";

export default function ItemMockApiHeader() {
  const { data: item = [], isLoading } = useitem();
  const additem = useAdditem();
  const updateitem = useUpdateitem();
  const deleteitem = useDeleteitem();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    schedule_code: "", schedule_name: "", description: "", requires_prescription: "", restricted_sale: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Add or Update
  const handleSubmit = () => {
    if (editMode) {
      updateitem.mutate(
        { id: formData.schedule_id, data: formData },
        {

          onSuccess: () => setOpen(false),
        }
      );
    } else {
      additem.mutate(formData, {
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
      deleteitem.mutate(id);
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
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add Drug Schedule
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
