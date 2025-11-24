// src/pages/item/components/ItemForm.jsx
import React, { useEffect } from "react";
import {
  TextField,
  MenuItem,
  Box,
} from "@mui/material";
import DraggableDialog from "../../../components/commen/DraggableDialog";
import { useHsn } from "@/hooks/useHsn";
import { useDrugSchedule } from "@/hooks/useDrugSchedule";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { itemSchema } from "../validation/itemSchema";

export default function ItemForm({
  open,
  onClose,
  onSubmit,
  editMode,
  defaultValues,
}) {
  const { data: hsns = [], isLoading: loadingHsn } = useHsn();
  const { data: drugschedule = [], isLoading: loadingSchedule } = useDrugSchedule();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(itemSchema),
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      brand: "",
      generic_name: "",
      manufacturer: "",
      description: "",
      item_type: "Medicine",
      hsn_id: "",
      schedule_id: "",
      pack_size: "",
      is_active: 1,
      ...defaultValues,
    },
  });

  // Reset values when dialog opens or defaultValues change (for edit mode)
  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name || "",
        sku: defaultValues?.sku || "",
        barcode: defaultValues?.barcode || "",
        brand: defaultValues?.brand || "",
        generic_name: defaultValues?.generic_name || "",
        manufacturer: defaultValues?.manufacturer || "",
        description: defaultValues?.description || "",
        item_type: defaultValues?.item_type || "Medicine",
        hsn_id: defaultValues?.hsn_id || "",
        schedule_id: defaultValues?.schedule_id || "",
        pack_size: defaultValues?.pack_size || "",
        is_active:
          typeof defaultValues?.is_active !== "undefined"
            ? defaultValues.is_active
            : 1,
      });
    }
  }, [open, defaultValues, reset]);

  const onFormSubmit = (values) => {
    const payload = {
      ...values,
      name: values.name.trim(),
      sku: values.sku.trim(),
      barcode: values.barcode?.trim() || null,
      brand: values.brand?.trim() || null,
      generic_name: values.generic_name?.trim() || null,
      manufacturer: values.manufacturer?.trim() || null,
      description: values.description?.trim() || null,
      item_type: values.item_type, // already a string
      hsn_id: Number(values.hsn_id),
      schedule_id: Number(values.schedule_id),
      pack_size: values.pack_size ? Number(values.pack_size) : null,
      is_active: values.is_active !== "" ? Number(values.is_active) : 1,
    };

    // pass reset so parent can clear form on success for "add"
    onSubmit(payload, () => {
      reset({
        name: "",
        sku: "",
        barcode: "",
        brand: "",
        generic_name: "",
        manufacturer: "",
        description: "",
        item_type: "Medicine",
        hsn_id: "",
        schedule_id: "",
        pack_size: "",
        is_active: 1,
      });
    });
  };

  return (
    <DraggableDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onFormSubmit)}
      editMode={editMode}
      title={editMode ? "Edit Item" : "Add New Item"}
      submitDisabled={isSubmitting}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" gap={2}>
          <TextField
            label="Name"
            fullWidth
            size="small"
            required
            autoComplete="off"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="SKU"
            fullWidth
            size="small"
            required
            autoComplete="off"
            {...register("sku")}
            error={!!errors.sku}
            helperText={errors.sku?.message}
          />

          <TextField
            label="Barcode"
            fullWidth
            size="small"
            autoComplete="off"
            {...register("barcode")}
            error={!!errors.barcode}
            helperText={errors.barcode?.message}
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            label="Brand"
            fullWidth
            size="small"
            required
            autoComplete="off"
            {...register("brand")}
            error={!!errors.brand}
            helperText={errors.brand?.message}
          />

          <TextField
            label="Generic Name"
            fullWidth
            size="small"
            autoComplete="off"
            {...register("generic_name")}
            error={!!errors.generic_name}
            helperText={errors.generic_name?.message}
          />

          <TextField
            label="Manufacturer"
            fullWidth
            size="small"
            autoComplete="off"
            {...register("manufacturer")}
            error={!!errors.manufacturer}
            helperText={errors.manufacturer?.message}
          />
        </Box>

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={2}
          size="small"
          autoComplete="off"
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message}
        />

        <Box display="flex" gap={2}>
          <Controller
            name="item_type"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="Item Type"
                fullWidth
                size="small"
                autoComplete="off"
                {...field}
                error={!!errors.item_type}
                helperText={errors.item_type?.message}
              >
                <MenuItem value="Medicine">Medicine</MenuItem>
                <MenuItem value="OTC">OTC</MenuItem>
                <MenuItem value="Consumable">Consumable</MenuItem>
                <MenuItem value="Accessory">Accessory</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            )}
          />


          <Controller
            name="hsn_id"
            control={control}
            render={({ field }) => (
              <TextField
                select
                label="HSN Code"
                fullWidth
                size="small"
                autoComplete="off"
                disabled={editMode}
                value={field.value ?? ""}      // important: allow "" for reset
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value);
                  field.onChange(val);
                }}
                error={!!errors.hsn_id}
                helperText={errors.hsn_id?.message}
              >
                <MenuItem value="">
                  <em>Select HSN</em>
                </MenuItem>
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
                select
                label="Schedule"
                fullWidth
                size="small"
                autoComplete="off"
                disabled={editMode}
                value={field.value ?? ""}      // important: allow "" for reset
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value);
                  field.onChange(val);
                }}
                error={!!errors.schedule_id}
                helperText={errors.schedule_id?.message}
              >
                <MenuItem value="">
                  <em>Select Schedule</em>
                </MenuItem>
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

        <Box display="flex" gap={2}>
          <TextField
            label="Pack Size"
            fullWidth
            size="small"
            autoComplete="off"
            {...register("pack_size")}
            error={!!errors.pack_size}
            helperText={errors.pack_size?.message}
          />

          <TextField
            label="Is Active (0/1)"
            fullWidth
            size="small"
            autoComplete="off"
            {...register("is_active")}
            error={!!errors.is_active}
            helperText={errors.is_active?.message}
          />
        </Box>
      </Box>
    </DraggableDialog>
  );
}
