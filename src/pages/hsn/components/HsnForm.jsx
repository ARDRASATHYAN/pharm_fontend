import React from "react";
import {
  
  TextField,
  
  Box,
} from "@mui/material";
import DraggableDialog from "../../../components/commen/DraggableDialog";



export default function HsnForm({
  open,
  onClose,
  onSubmit,
  formData,
  onChange,
  editMode,
}) {
  return (
    <DraggableDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      editMode={editMode}
      title={editMode ? "Edit Hsn" : "Add New Hsn"}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" gap={2}>
          <TextField
            label="hsn_code"
            name="hsn_code"
            value={formData.hsn_code}
            onChange={onChange}
            fullWidth
            size="small"
            required
          />
          <TextField
            label="gst_rate"
            name="gst_percent"
            value={formData.gst_percent}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
        {!editMode && (
          <TextField
            label="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            type="text"
            fullWidth
            multiline
            rows={4}
            size="small"
            required
          />
        )}

      </Box>
    </DraggableDialog>

  );
}
