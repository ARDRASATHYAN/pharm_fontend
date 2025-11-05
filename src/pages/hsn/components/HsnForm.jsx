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
            value={formData.username}
            onChange={onChange}
            fullWidth
            size="small"
            required
          />

          {!editMode && (
            <TextField
              label="address"
              name="address"
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
 <Box display="flex"  gap={2}>
          <TextField
            label="city"
            name="city"
            value={formData.full_name}
            onChange={onChange}
            fullWidth
            size="small"
          />
          
          <TextField
            label="state"
            name="state"
            value={formData.full_name}
            onChange={onChange}
            fullWidth
            size="small"
          />
          </Box>
           <Box display="flex"  gap={2}>
            <TextField
            label="gst_no"
            name="gst_no"
            value={formData.full_name}
            onChange={onChange}
            fullWidth
            size="small"
          />
            <TextField
            label="phone"
            name="phone"
            value={formData.full_name}
            onChange={onChange}
            fullWidth
            size="small"
          />
          </Box>
            <TextField
            label="email"
            name="email"
            value={formData.full_name}
            onChange={onChange}
            fullWidth
            size="small"
          />

         
        </Box>
      </DraggableDialog>
   
  );
}
