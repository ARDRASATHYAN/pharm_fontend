import React from "react";
import {

  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
} from "@mui/material";
import DraggableDialog from "../../../components/commen/DraggableDialog";
import { useRoles } from "@/hooks/useRoles";


// const roles = ["Admin", "Manager", "Pharmacist", "Billing", "StoreKeeper"];

export default function UserForm({
  open,
  onClose,
  onSubmit,
  formData,
  onChange,
  editMode,
}) {

   const { data: roles = [], isLoading } = useRoles();
  return (
    <DraggableDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      editMode={editMode}
      title={editMode ? "Edit User" : "Add New User"}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" gap={2}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={onChange}
            fullWidth
            size="small"
            required
          />

          <TextField
            label="Full Name"
            name="full_name"
            value={formData.full_name}
            onChange={onChange}
            fullWidth
            size="small"
            required
          />
        </Box>
        {!editMode && (
          <TextField
            label="Password"
            name="password"
            value={formData.password_hash}
            onChange={onChange}
            type="password"
            fullWidth
            size="small"
            required
          />
        )}



        <TextField
          select
          label="Role"
          name="role"
          value={formData.role}
          onChange={onChange}
          fullWidth
          size="small"
          required
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>

       <FormControlLabel
  control={
    
    <Switch
      checked={!!formData.is_active} // converts any truthy/falsy value to real boolean
      onChange={(e) =>
        onChange({
          target: { name: "is_active", value: e.target.checked ? 1 : 0 },
        })
      }
    />
  }
  label={formData.is_active ? "Active" : "Inactive"} // will now work properly
/>

      </Box>
    </DraggableDialog>

  );
}
