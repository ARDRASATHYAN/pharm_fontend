import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import CategoryForm from "./CategoryForm";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "./mockCategoryApi";
import DataTable from "../../../components/commen/Datatable";
import { getCategoryColumns } from "./CategoryHeader";

export default function CategoryPage() {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    code: "",
    type: "",
    description: "",
    status: "Active",
  });

  // Fetch mock data
  const fetchData = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle dialog open
  const handleOpen = (category = null, index = null) => {
    if (category) {
      setFormData(category);
      setEditIndex(index);
    } else {
      setFormData({
        id: "",
        name: "",
        code: "",
        type: "",
        description: "",
        status: "Active",
      });
      setEditIndex(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Add or update
  const handleSubmit = async () => {
    if (editIndex !== null) {
      await updateCategory(editIndex, formData);
    } else {
      await addCategory(formData);
    }
    fetchData();
    setOpen(false);
  };

  // Delete
  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(index);
      fetchData();
    }
  };

  const columns = getCategoryColumns(handleOpen, handleDelete);

  return (
    <Box p={3}>
      {/* Header */}
      <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
        Medicine Categories
      </Typography>

      {/* Content */}
     
          {/* Header Bar */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Category List
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpen()}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 3,
                backgroundColor: "#2563eb",
                "&:hover": { backgroundColor: "#1e40af" },
              }}
            >
              Add Category
            </Button>
          </Box>

          {/* Data Table */}
          <DataTable columns={columns} data={categories} />
       
      {/* Add/Edit Form Dialog */}
      <CategoryForm
        open={open}
        onClose={handleClose}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        editMode={editIndex !== null}
      />
    </Box>
  );
}
