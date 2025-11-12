import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import {useAddStoreStock, useDeleteStoreStock, useStoreStock, useUpdateStoreStock } from "@/hooks/useStoreStock";
import StoreStockForm from "./components/StoreStockForm";
import { getStoreStockColumns } from "./components/StoreStockHeader";

export default function StoreStockMockApiHeader() {
  const { data: storestock = [], isLoading ,isFetching} = useStoreStock();
  console.log('storestock',storestock);
  const storestocks = storestock?.data || [];
  
  const addStoreStock = useAddStoreStock();
  const updateStoreStock = useUpdateStoreStock();
  const deleteStoreStock = useDeleteStoreStock();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
   
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Add or Update
  const handleSubmit = () => {
    if (editMode) {
      updateStoreStock.mutate(
        { id: formData.stock_id, data: formData },
        {

          onSuccess: () => setOpen(false),
        }
      );
    } else {
      addStoreStock.mutate(formData, {
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
      deleteStoreStock.mutate(id);
    }
  };





  // ✅ pass handlers to columns (so edit/delete buttons work)
  const columns = getStoreStockColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
          Stock List
        </h2>
        <Button variant="contained" color="primary" onClick={() => {
    // 🧹 Clear previous data before opening
    setFormData({
     
    });
    setEditMode(false);
    setOpen(true);
  }}>
          Add StoreStock
        </Button>
      </div>


      <BasicTable columns={columns} data={storestocks} loading={isLoading || isFetching} />


      <StoreStockForm
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
