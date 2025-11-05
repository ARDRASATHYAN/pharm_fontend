import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";
import DraggableDialog from "../../../components/commen/DraggableDialog";

const roles = ["Admin", "Manager", "Pharmacist", "Billing", "StoreKeeper"];

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
            value={formData.username}
            onChange={onChange}
            fullWidth
            size="small"
            required
          />
          <TextField
            label="gst_rate"
            name="gst_rate"
            value={formData.full_name}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
        {!editMode && (
          <TextField
            label="description"
            name="description"
            value={formData.password_hash}
            onChange={onChange}
            type="password"
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
