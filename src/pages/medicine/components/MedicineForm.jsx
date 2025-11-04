import { useForm } from "react-hook-form";
import CustomizedDialogs from "../../../components/commen/Dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import { useState } from "react";

// ✅ Define Yup validation schema
const medicineSchema = yup.object().shape({
    medicineId: yup.string().optional(),
    name: yup.string().required("Medicine name is required"),
    category: yup.string().required("Category is required"),
    manufacturer: yup.string().required("Manufacturer is required"),
    batchNo: yup.string().required("Batch number is required"),
    manufactureDate: yup.date().required("Manufacture date is required"),
    Expiry: yup
        .date()
        .required("Expiry date is required")
        .min(yup.ref("manufactureDate"), "Expiry must be after manufacture date"),
    quantity: yup
        .number()
        .typeError("Quantity must be a number")
        .positive("Quantity must be greater than 0")
        .required("Quantity is required"),
    unitPrice: yup
        .number()
        .typeError("Unit price must be a number")
        .positive("Unit price must be greater than 0")
        .required("Unit price is required"),
    sellingPrice: yup
        .number()
        .typeError("Selling price must be a number")
        .moreThan(yup.ref("unitPrice"), "Selling price must be higher than unit price")
        .required("Selling price is required"),
    rackNo: yup.string().required("Rack number is required"),
    supplier: yup.string().required("Supplier name is required"),
    createdBy: yup.string().required("Created By field is required"),
    updatedAt: yup.string().optional(),
    status: yup.string().required("Status is required"),
});


export default function MedicineForm({ open, handleClose, onSubmit }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(medicineSchema),
        defaultValues: {
            medicineId: "",
            name: "",
            category: "",
            manufacturer: "",
            batchNo: "",
            Expiry: "",
            manufactureDate: "",
            quantity: "",
            unitPrice: "",
            sellingPrice: "",
            rackNo: "",
            supplier: "",
            createdBy: "",
            updatedAt: "",
            status: "Active",
        },
    });
    const [Status, setStatus] = useState('');

    const handleChange = (event) => {
        setStatus(event.target.value);
    };

    const submitForm = (data) => {
        console.log("✅ Submitted Data:", data);
        if (onSubmit) onSubmit(data);
        reset();
        handleClose(); // Close after submit
    };

    return (
        <CustomizedDialogs open={open} handleClose={handleClose}>
            <form onSubmit={handleSubmit(submitForm)} className="grid grid-cols-2 gap-4">
                {/* Medicine ID */}
                <div>
                    <TextField {...register("medicineId")} id="Medicine ID" label="Medicine ID" size="small" color="black" variant="outlined" />
                </div>

                {/* Name */}
                <div>
                    <TextField  {...register("name")} id="Name" label="Name" size="small" color="black" variant="outlined" />
                </div>

                {/* Category */}
                <div>
                    <TextField {...register("category")} id="Category" label="Category" size="small" color="black" variant="outlined" />
                </div>

                {/* Manufacturer */}
                <div>
                    <TextField {...register("manufacturer")} id="Manufacturer" label="Manufacturer" size="small" color="black" variant="outlined" />
                </div>

                {/* Batch No */}
                <div>
                    <TextField {...register("batchNo")} id="Batch No" label="Batch No" size="small" color="black" variant="outlined" />
                </div>

                {/* Dates */}
                <div>
                    <TextField {...register("manufactureDate")} id="Manufacture Date" label="Manufacture Date" size="small" color="black" variant="outlined" />
                </div>

                <div>
                    <TextField {...register("Expiry")} id="Expiry Date" label="Expiry Date" size="small" color="black" variant="outlined" />
                </div>

                {/* Quantity */}
                <div>
                    <TextField {...register("quantity")} id="Quantity" label="Quantity" size="small" color="black" variant="outlined" />
                </div>

                {/* Prices */}
                <div>
                    <TextField {...register("unitPrice")} id="Unit Price" label="Unit Price" size="small" color="black" variant="outlined" />
                </div>

                <div>
                    <TextField {...register("sellingPrice")} id="Selling Price" label="Selling Price" size="small" color="black" variant="outlined" />
                </div>

                {/* Rack & Supplier */}
                <div>
                    <TextField {...register("rackNo")} id="Rack No" label="Rack No" size="small" color="black" variant="outlined" />
                </div>

                <div>
                    <TextField {...register("supplier")} id="Supplier" label="Supplier" size="small" color="black" variant="outlined" />
                </div>

                {/* CreatedBy */}
                <div>
                    <TextField {...register("createdBy")} id="Created By" label="Created By" size="small" color="black" variant="outlined" />
                </div>

                {/* UpdatedAt */}
                <div>
                    <TextField {...register("updatedAt")} id="Updated At" label="Updated At" size="small" color="black" variant="outlined" />
                </div>

                {/* Status */}
                <div>
                    <FormControl sx={{ m: 1, minWidth: 120 }} >
                        <InputLabel id="demo-simple-select-required-label">Status</InputLabel>
                        <Select
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            {...register("status")}
                            value={Status}
                            label="Status"
                            onChange={handleChange} size="small" color="black"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Active</MenuItem>
                            <MenuItem value={20}>Low Stock</MenuItem>
                            <MenuItem value={30}>Expired</MenuItem>
                            <MenuItem value={30}>Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </form>
        </CustomizedDialogs>
    );
}
