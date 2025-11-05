import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Paper,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

export default function CategoryPage() {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [categories, setCategories] = useState([
    {
      id: "CAT001",
      name: "Antibiotics",
      code: "ABX",
      type: "Tablet",
      status: "Active",
      description: "Used for bacterial infections",
    },
  ]);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    code: "",
    type: "",
    description: "",
    status: "Active",
  });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editIndex !== null) {
      const updated = [...categories];
      updated[editIndex] = formData;
      setCategories(updated);
    } else {
      setCategories([...categories, { ...formData, id: `CAT${Date.now()}` }]);
    }
    setOpen(false);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2} color="primary">
        Medicine Categories
      </Typography>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Category List</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpen()}
              sx={{ borderRadius: 2, backgroundColor: "#2563eb", "&:hover": { backgroundColor: "#1e40af" } }}
            >
              Add Category
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Code</strong></TableCell>
                  <TableCell><strong>Type</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((cat, index) => (
                  <TableRow key={index}>
                    <TableCell>{cat.id}</TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.code}</TableCell>
                    <TableCell>{cat.type}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color: cat.status === "Active" ? "green" : "gray",
                          fontWeight: 500,
                        }}
                      >
                        {cat.status}
                      </Typography>
                    </TableCell>
                    <TableCell>{cat.description}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleOpen(cat, index)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(index)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editIndex !== null ? "Edit Category" : "Add New Category"}</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              name="name"
              label="Category Name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              name="code"
              label="Category Code"
              value={formData.code}
              onChange={handleChange}
              fullWidth
              size="small"
            />
            <TextField
              name="type"
              label="Medicine Type"
              select
              value={formData.type}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="Tablet">Tablet</MenuItem>
              <MenuItem value="Syrup">Syrup</MenuItem>
              <MenuItem value="Injection">Injection</MenuItem>
              <MenuItem value="Capsule">Capsule</MenuItem>
            </TextField>
            <TextField
              name="status"
              label="Status"
              select
              value={formData.status}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
            <TextField
              name="description"
              label="Description"
              multiline
              rows={2}
              value={formData.description}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1e40af" },
              borderRadius: 2,
            }}
          >
            {editIndex !== null ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
