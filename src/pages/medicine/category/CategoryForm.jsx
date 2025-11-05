import React from "react";
import { Box, TextField, MenuItem } from "@mui/material";
import DraggableDialog from "../../../components/commen/DraggableDialog";


export default function CategoryForm({
  open,
  onClose,
  formData,
  onChange,
  onSubmit,
  editMode,
}) {
  return (
    <DraggableDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      editMode={editMode}
      title={editMode ? "Edit Category" : "Add New Category"}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          name="name"
          label="Category Name"
          value={formData.name}
          onChange={onChange}
          fullWidth
          size="small"
        />
        <TextField
          name="code"
          label="Category Code"
          value={formData.code}
          onChange={onChange}
          fullWidth
          size="small"
        />
        <TextField
          name="type"
          label="Medicine Type"
          select
          value={formData.type}
          onChange={onChange}
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
          onChange={onChange}
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
          onChange={onChange}
          fullWidth
          size="small"
        />
      </Box>
    </DraggableDialog>
  );
}
