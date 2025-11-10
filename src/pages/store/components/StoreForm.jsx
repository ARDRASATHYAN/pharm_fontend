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

export default function StoreForm({
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
      title={editMode ? "Edit Store" : "Add New store"}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="store_name"
          name="store_name"
          value={formData.store_name}
          onChange={onChange}
          fullWidth
          size="small"
          required
        />

        {!editMode && (
          <TextField
            label="address"

            name="address"
            
            value={formData.address}
            onChange={onChange}
          type="text"
            fullWidth
            multiline
            rows={3}
            size="small"
            required
          />
        )}
        <TextField
          label="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          fullWidth
          size="small"
        />
        <Box display="flex" gap={2}>
          <TextField
            label="city"
            name="city"
            
            
            value={formData.city}
            onChange={onChange}
            fullWidth
            size="small"
          />

          <TextField
            label="state"
            name="state"

            value={formData.state}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
        <Box display="flex" gap={2}>
          <TextField
            label="gst_no"
            name="gst_no"            
            value={formData.gst_no}
            onChange={onChange}
            fullWidth
            size="small"
          />
          <TextField
            label="phone"
            name="phone"
            value={formData.phone}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
      </Box>
    </DraggableDialog>

  );
}
