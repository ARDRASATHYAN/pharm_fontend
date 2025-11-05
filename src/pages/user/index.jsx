import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import UserForm from "./components/UserForm";
import DataTable from "../../components/commen/Datatable";
import { getUserColumns } from "./components/Userheader";
import { createUser, deleteUser, getUsers, updateUser } from "../../services/api";

export default function UserMockApiHeader() {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password_hash: "",
    full_name: "",
    role: "Billing",
    is_active: 1,
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle submit (Add/Edit)
  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updateUser(formData.id, formData);
      } else {
        await createUser(formData);
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
      await deleteUser(id);
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ pass handlers to columns (so edit/delete buttons work)
  const columns = getUserColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
       <h2 className="text-xl font-bold text-blue-700 tracking-wide">
            Medicine Entry
          </h2>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add User
        </Button>
      </div>


  <DataTable columns={columns} data={users} />


      <UserForm
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
