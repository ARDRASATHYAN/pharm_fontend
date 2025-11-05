import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DataTable from "../../components/commen/Datatable";
import { createStore, deleteStore, getStores, updateStore } from "../../services/storeApi";
import HsnForm from "./components/HsnForm";
import { getHsnColumns } from "./components/HsnHeader";

export default function HsnMockApiHeader() {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
 const [formData, setFormData] = useState({
    store_name: "",
    address: "",
    city: "",
    state: "",
    gst_no: "",
    phone: "",
    email: "",
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const data = await getStores();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle submit (Add/Edit)
  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updateStore(formData.id, formData);
      } else {
        await createStore(formData);
      }
      await fetchUsers();
      setOpen(false);
      setEditMode(false);
    } catch (error) {
      console.error("Error submitting user:", error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Edit user
  const handleEdit = (user) => {
    setFormData(user);
    setEditMode(true);
    setOpen(true);
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await deleteStore(id);
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ pass handlers to columns (so edit/delete buttons work)
  const columns = getHsnColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
       <h2 className="text-xl font-bold text-blue-700 tracking-wide">
            Store List
          </h2>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add Store
        </Button>
      </div>


  <DataTable columns={columns} data={users} />


      <HsnForm
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
