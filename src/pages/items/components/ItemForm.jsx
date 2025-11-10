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



export default function ItemForm({
  open,
  onClose,
  onSubmit,
  formData,
  onChange,
  editMode,
}) {
    const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sku: "",
      barcode: "",
      name: "",
      brand: "",
      generic_name: "",
      manufacturer: "",
      hsn_id: "",
      schedule_id: "",
      description: "",
      item_type: "",
      pack_size: "",
      is_active: true,
    },
  });

    const { data: hsns = [], isLoading: loadingHsn } = useHsn();
const { data: drugschedule = [], isLoading: loadingSchedule } = useDrugSchedule();

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
            label="sku"
            name="sku"
            value={formData.sku}
            onChange={onChange}
            fullWidth
            size="small"
            required
          />
          <TextField
            label="barcode"
            name="barcode"
            value={formData.barcode}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
        {!editMode && (
          <TextField
            label="name"
            name="name"
            value={formData.name}
            onChange={onChange}
            type="text"
            fullWidth
            multiline
            rows={4}
            size="small"
            required
          />
        )}
        <TextField
            label="brand"
            name="brand"
            value={formData.brand}
            onChange={onChange}
            type="text"
            fullWidth
            multiline
            rows={2}
            size="small"
            required
          />
        <Box display="flex" gap={2}>
          <TextField
            label="generic_name"
            name="generic_name"
            value={formData.generic_name}
            onChange={onChange}
            fullWidth
            size="small"
          />
          <TextField
            label="manufacturer"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
         <Box display="flex" gap={2}>
          <TextField
            label="description"
            name="description"
            value={formData.description}
            onChange={onChange}
            fullWidth
            size="small"
          />
          <TextField
            label="item_type"
            name="item_type"
            value={formData.item_type}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
         <Box display="flex" gap={2}>
          <TextField
            label="pack_size"
            name="pack_size"
            value={formData.pack_size}
            onChange={onChange}
            fullWidth
            size="small"
          />
          <TextField
            label="is_active"
            name="is_active"
            value={formData.is_active}
            onChange={onChange}
            fullWidth
            size="small"
          />
        </Box>
        <Box display="flex" gap={2}>
  <Controller
    name="hsn_id"
    control={control}
    rules={{ required: "HSN is required" }}
    render={({ field, fieldState }) => (
      <TextField
        {...field}
        label="HSN Code"
        fullWidth
        size="small"
        select
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
        disabled={loadingHsn}
      >
        {loadingHsn ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : (
          hsns.map((hsn) => (
            <MenuItem key={hsn.hsn_id} value={hsn.hsn_id}>
              {hsn.hsn_code} — {hsn.description}
            </MenuItem>
          ))
        )}
      </TextField>
    )}
  />
   <Controller
    name="schedule_id"
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        label="Schedule"
        fullWidth
        size="small"
        select
        disabled={loadingSchedule}
      >
        {loadingSchedule ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : (
          drugschedule.map((s) => (
            <MenuItem key={s.schedule_id} value={s.schedule_id}>
              {s.schedule_code}
            </MenuItem>
          ))
        )}
      </TextField>
    )}
  />
</Box>



      </Box>
    </DraggableDialog>

  );
}
