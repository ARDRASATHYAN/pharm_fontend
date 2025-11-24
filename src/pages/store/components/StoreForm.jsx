// src/pages/store/components/StoreForm.jsx
import React, { useEffect } from "react";
import { TextField, Box } from "@mui/material";
import DraggableDialog from "@/components/commen/DraggableDialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { storeSchema } from "../validation/storeSchema";

export default function StoreForm({
  open,
  onClose,
  onSubmit,
  defaultValues,
  editMode,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(storeSchema),
    defaultValues: {
      store_name: "",
      address: "",
      email: "",
      city: "",
      state: "",
      gst_no: "",
      phone: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        store_name: defaultValues?.store_name || "",
        address: defaultValues?.address || "",
        email: defaultValues?.email || "",
        city: defaultValues?.city || "",
        state: defaultValues?.state || "",
        gst_no: defaultValues?.gst_no || "",
        phone: defaultValues?.phone || "",
      });
    }
  }, [open, defaultValues, reset]);

  const onFormSubmit = (values) => {
    const payload = {
      ...values,
      store_name: values.store_name.trim(),
      address: values.address.trim(),
      email: values.email?.trim() || null,
      city: values.city?.trim() || null,
      state: values.state?.trim() || null,
      gst_no: values.gst_no?.trim() || null,
      phone: values.phone?.trim() || null,
    };

    // pass reset so parent can clear form on success for "add"
    onSubmit(payload, () => {
      reset({
        store_name: "",
        address: "",
        email: "",
        city: "",
        state: "",
        gst_no: "",
        phone: "",
      });
    });
  };

  return (
    <DraggableDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onFormSubmit)}
      editMode={editMode}
      title={editMode ? "Edit Store" : "Add New Store"}
      submitDisabled={isSubmitting}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Store Name"
          fullWidth
          size="small"
          required
          autoComplete="off"
          {...register("store_name")}
          error={!!errors.store_name}
          helperText={errors.store_name?.message}
        />

        <TextField
          label="Address"
          fullWidth
          size="small"
          required
          multiline
          rows={3}
          autoComplete="off"
          {...register("address")}
          error={!!errors.address}
          helperText={errors.address?.message}
        />

        <TextField
          label="Email"
          fullWidth
          size="small"
          autoComplete="off"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <Box display="flex" gap={2}>
          <TextField
            label="City"
            fullWidth
            size="small"
            autoComplete="off"
            {...register("city")}
            error={!!errors.city}
            helperText={errors.city?.message}
          />

          <TextField
            label="State"
            fullWidth
            size="small"
            autoComplete="off"
            {...register("state")}
            error={!!errors.state}
            helperText={errors.state?.message}
          />
        </Box>

        <Box display="flex" gap={2}>
          <TextField
            label="GST No"
            fullWidth
            size="small"
            autoComplete="off"
            {...register("gst_no")}
            error={!!errors.gst_no}
            helperText={errors.gst_no?.message}
          />

          <TextField
            label="Phone"
            fullWidth
            size="small"
            autoComplete="off"
            {...register("phone")}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />
        </Box>
      </Box>
    </DraggableDialog>
  );
}
