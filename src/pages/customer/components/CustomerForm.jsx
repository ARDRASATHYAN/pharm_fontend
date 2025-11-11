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
import { useHsn } from "@/hooks/useHsn";
import { useDrugSchedule } from "@/hooks/useDrugSchedule";
import { Controller, useForm } from "react-hook-form";



export default function CustomerForm({
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
      title={editMode ? "Edit Customer" : "Add New Customer"}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" gap={2}>
          <TextField
            label="customer_name"
            name="customer_name"
            value={formData.customer_name}
            onChange={onChange}
            fullWidth
            size="small"
            required
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
        {!editMode && (
          <TextField
            label="address"
            name="address"
            value={formData.address}
            onChange={onChange}
            type="text"
            fullWidth
            multiline
            rows={4}
            size="small"
            required
          />
        )}
      
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
            label="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
         <Box display="flex" gap={2}>
          <TextField
            label="doctor_name"
            name="doctor_name"
            value={formData.doctor_name}
            onChange={onChange}
            fullWidth
            size="small"
          />
          <TextField
            label="prescription_no"
            name="prescription_no"
            value={formData.prescription_no}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
        
        
        




      </Box>
    </DraggableDialog>

  );
}
