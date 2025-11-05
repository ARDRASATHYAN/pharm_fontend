import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextField, MenuItem, Button, Box, Grid } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// ✅ Validation
const schema = yup.object({
  name: yup.string().required("Medicine name is required"),
  category: yup.string().required("Category is required"),
  manufacturer: yup.string().required("Manufacturer is required"),
  batchNo: yup.string().required("Batch number is required"),
  manufactureDate: yup.date().required("Required"),
  expiry: yup
    .date()
    .required("Required")
    .min(yup.ref("manufactureDate"), "Expiry must be after manufacture date"),
  quantity: yup.number().positive().required("Required"),
  unitPrice: yup.number().positive().required("Required"),
  sellingPrice: yup
    .number()
    .positive()
    .moreThan(yup.ref("unitPrice"), "Must be higher than unit price")
    .required("Required"),
  rackNo: yup.string().required("Required"),
  supplier: yup.string().required("Required"),
  createdBy: yup.string().required("Required"),
  status: yup.string().required("Required"),
});

export default function MedicineForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(schema) });

  const [status, setStatus] = useState("Active");
  const [manufactureDate, setManufactureDate] = useState(null);
  const [expiry, setExpiry] = useState(null);

  const onSubmit = (data) => {
    console.log("✅ Form submitted:", data);
    reset();
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="text-center">
          <h2 className="text-xl font-bold text-blue-700 tracking-wide">
            Medicine Entry
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Add medicine information in the system
          </p>
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} mt={2}>
              {/* Left column */}
               <Box mt={2} display="flex" gap={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("name")}
                  fullWidth
                  label="Medicine Name"
                  size="small"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />

                <Box mt={2}>
                  <TextField
                    {...register("category")}
                    fullWidth
                    label="Category"
                    size="small"
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  />
                </Box>

                <Box mt={2}>
                  <TextField
                    {...register("manufacturer")}
                    fullWidth
                    label="Manufacturer"
                    size="small"
                    error={!!errors.manufacturer}
                    helperText={errors.manufacturer?.message}
                  />
                </Box>

                <Box mt={2}>
                  <TextField
                    {...register("batchNo")}
                    fullWidth
                    label="Batch Number"
                    size="small"
                    error={!!errors.batchNo}
                    helperText={errors.batchNo?.message}
                  />
                </Box>

                <Box mt={2} display="flex" gap={2}>
                  <DatePicker
                    label="Manufacture Date"
                    value={manufactureDate}
                    onChange={(newValue) => {
                      setManufactureDate(newValue);
                      setValue("manufactureDate", newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errors.manufactureDate,
                        helperText: errors.manufactureDate?.message,
                      },
                    }}
                  />

                  <DatePicker
                    label="Expiry Date"
                    value={expiry}
                    onChange={(newValue) => {
                      setExpiry(newValue);
                      setValue("expiry", newValue);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                        error: !!errors.expiry,
                        helperText: errors.expiry?.message,
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* Right column */}
              <Grid item xs={12} md={6}>
                <Box display="flex" gap={2}>
                  <TextField
                    {...register("quantity")}
                    type="number"
                    label="Quantity"
                    size="small"
                    fullWidth
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                  />
                  <TextField
                    {...register("unitPrice")}
                    type="number"
                    label="Unit Price"
                    size="small"
                    fullWidth
                    error={!!errors.unitPrice}
                    helperText={errors.unitPrice?.message}
                  />
                  <TextField
                    {...register("sellingPrice")}
                    type="number"
                    label="Selling Price"
                    size="small"
                    fullWidth
                    error={!!errors.sellingPrice}
                    helperText={errors.sellingPrice?.message}
                  />
                </Box>

                <Box mt={2} display="flex" gap={2}>
                  <TextField
                    {...register("rackNo")}
                    label="Rack No"
                    size="small"
                    fullWidth
                    error={!!errors.rackNo}
                    helperText={errors.rackNo?.message}
                  />
                  <TextField
                    {...register("supplier")}
                    label="Supplier"
                    size="small"
                    fullWidth
                    error={!!errors.supplier}
                    helperText={errors.supplier?.message}
                  />
                </Box>

                <Box mt={2}>
                  <TextField
                    {...register("createdBy")}
                    fullWidth
                    label="Created By"
                    size="small"
                    error={!!errors.createdBy}
                    helperText={errors.createdBy?.message}
                  />
                </Box>

                <Box mt={2}>
                  <TextField
                    {...register("status")}
                    fullWidth
                    select
                    label="Status"
                    size="small"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    error={!!errors.status}
                    helperText={errors.status?.message}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Low Stock">Low Stock</MenuItem>
                    <MenuItem value="Expired">Expired</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </TextField>
                </Box>
              </Grid>
              </Box>

              {/* Buttons */}
              
            </Grid>
            <Grid item xs={12}>
                <Box mt={3} display="flex" gap={2}>
                  <Button
                    type="button"
                    variant="outlined"
                    fullWidth
                    size="large"
                    sx={{
                      fontWeight: "bold",
                      borderRadius: 2,
                    }}
                    onClick={() => reset()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      backgroundColor: "#2563eb",
                      "&:hover": { backgroundColor: "#1e40af" },
                      fontWeight: "bold",
                      borderRadius: 2,
                    }}
                  >
                    Save Medicine
                  </Button>
                </Box>
              </Grid>
          </form>
        </LocalizationProvider>
      </div>
    </div>
  );
}
