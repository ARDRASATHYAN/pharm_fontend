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

export default function DrugScheduleForm({
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
      title={editMode ? "Edit Drug Schedule" : "Add New Drug Schedule"}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" gap={2}>
          <TextField
            label="schedule_code"
            name="schedule_code"
            value={formData.username}
            onChange={onChange}
            fullWidth
            size="small"
            required
          />
          <TextField
            label="schedule_name"
            name="schedule_name"
            value={formData.full_name}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
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
        <Box display="flex" gap={2}>
          <TextField
            label="requires_prescription	"
            name="requires_prescription	"
            value={formData.full_name}
            onChange={onChange}
            fullWidth
            size="small"
          />
          <TextField
            label="restricted_sale"
            name="restricted_sale"
            value={formData.full_name}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
      </Box>
    </DraggableDialog>

  );
}
