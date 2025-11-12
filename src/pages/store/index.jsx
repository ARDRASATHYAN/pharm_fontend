import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import StoreForm from "./components/StoreForm";
import { getStoreColumns } from "./components/StoreHeader";
import BasicTable from "@/components/commen/BasicTable";
import { useAddStore, useDeleteStore, useStores, useUpdateStore } from "@/hooks/useStore";

export default function StoreMockApiHeader() {
  const { data: stores = [], isLoading,isFetching } = useStores();
  const addStore = useAddStore();
  const updateStore = useUpdateStore();
  const deleteStore = useDeleteStore();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    store_name: "",
    address: "",
    city: "",
    state: "",
    gst_no: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Add or Update
  const handleSubmit = () => {
    if (editMode) {
      updateStore.mutate(
        { id: formData.store_id, data: formData },
        {

          onSuccess: () => setOpen(false),
        }
      );
    } else {
      addStore.mutate(formData, {
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
      deleteStore.mutate(id);
    }
  };




  // ✅ pass handlers to columns (so edit/delete buttons work)
  const columns = getStoreColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
          Store List
        </h2>
        <Button variant="contained" color="primary" onClick={() => {
          setOpen(true);
          setEditMode(false);
          setFormData({
            store_name: "",
            address: "",
            city: "",
            state: "",
            gst_no: "",
            phone: "",
            email: "",
          });
        }}>
          Add Store
        </Button>
      </div>


      <BasicTable columns={columns} data={stores} loading={isLoading || isFetching}/>


      <StoreForm
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
