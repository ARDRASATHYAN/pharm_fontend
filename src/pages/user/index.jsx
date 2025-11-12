import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import UserForm from "./components/UserForm";
import { getUserColumns } from "./components/Userheader";
import BasicTable from "@/components/commen/BasicTable";
import { useAddUser, useDeleteUser, useUpdateUser, useUsers } from "@/hooks/useUsers";

export default function UserMockApiHeader() {
 const { data: users = [], isLoading ,isFetching } = useUsers();
  const addUser = useAddUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: "",
    role: "Billing",
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🟢 Add or Update
  const handleSubmit = () => {
    if (editMode) {
      updateUser.mutate(
        { id: formData.user_id, data: formData },
        {
          onSuccess: () => setOpen(false),
        }
      );
    } else {
      addUser.mutate(formData, {
        onSuccess: () => setOpen(false),
      });
    }
  };

  // ✏️ Edit Handler
  const handleEdit = (row) => {
    setFormData(row);
    setEditMode(true);
    setOpen(true);
  };

  // ❌ Delete Handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser.mutate(id);
    }
  };

  const columns = getUserColumns(handleEdit, handleDelete);

  // if (isLoading) return <p>Loading users...</p>;

 

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
       <h2 className="text-xl font-bold text-blue-700 tracking-wide">
           User List
          </h2>
        <Button variant="contained" color="primary" onClick={() => {
            setOpen(true);
            setEditMode(false);
            setFormData({
              username: "",
              password: "",
              full_name: "",
              role: "Billing",
              is_active: true,
            });
          }}>
          Add User
        </Button>
      </div>


  <BasicTable columns={columns} data={users} loading={isLoading || isFetching} />


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
