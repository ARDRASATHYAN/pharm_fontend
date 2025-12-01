import React, { useEffect } from "react";
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";
import DraggableDialog from "@/components/commen/DraggableDialog";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../validation/userSchema";


export default function UserForm({
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
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
      full_name: "",
      role: "Billing",
      is_active: true,
      isNew: !editMode,
      ...defaultValues,
    },
  });
  const roles = ['Admin','Manager','Pharmacist','Billing','StoreKeeper'];


  // When dialog opens or editing user changes reset form values
  useEffect(() => {
    if (open) {
      reset({
        username: defaultValues?.username || "",
        password: "",
        full_name: defaultValues?.full_name || "",
        role: defaultValues?.role || "Billing",
        is_active:
          typeof defaultValues?.is_active === "boolean"
            ? defaultValues.is_active
            : true,
      });
    }
  }, [open, defaultValues, reset]);

  const isActive = watch("is_active") ?? true;


  const onFormSubmit = (values) => {
    const { isNew, ...payload } = values;

    payload.is_active = values.is_active ? 1 : 0;

    if (editMode && !payload.password) {
      delete payload.password;
    }

    onSubmit(payload);
  };


  console.log("FORM WATCH role:", watch("role"));
  console.log("defaultValues in form:", defaultValues);

  return (
    <DraggableDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit(onFormSubmit)}
      editMode={editMode}
      title={editMode ? "Edit User" : "Add New User"}
      submitDisabled={isSubmitting}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" gap={2}>
          <TextField
            label="Username"
            fullWidth
            size="small"
            required
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
            autoComplete="off"

          />

          <TextField
            label="Full Name"
            fullWidth
            size="small"
            required
            {...register("full_name")}
            error={!!errors.full_name}
            helperText={errors.full_name?.message}
            autoComplete="off"
          />
        </Box>

        <TextField
          label="Password"
          type="password"
          fullWidth
          size="small"
          autoComplete="new-password"
         
          {...register("password")}
          error={!!errors.password}
          helperText={
            errors.password?.message ||
            (editMode ? "Leave blank to keep existing password" : "")
          }
        />

     <Controller
  name="role"
  control={control}
  render={({ field }) => (
    <TextField
      select
      label="Role"
      fullWidth
      size="small"
      required
      {...field}
      value={field.value || ""}
      error={!!errors.role}
      helperText={errors.role?.message}
    >
      {isLoading && <MenuItem disabled>Loading roles...</MenuItem>}

      {!isLoading && roles.length === 0 && (
        <MenuItem disabled>No roles found</MenuItem>
      )}

      {!isLoading &&
        roles.map((role) => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
    </TextField>
  )}
/>



        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={(e) =>
                setValue("is_active", e.target.checked ? 1 : 0, {
                  shouldDirty: true,
                })
              }
            />
          }
          label={isActive ? "Active" : "Inactive"}
        />
      </Box>
    </DraggableDialog>
  );
}
