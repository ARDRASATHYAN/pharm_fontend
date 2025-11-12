import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { useAddCustomer, useCustomer, useDeleteCustomer, useUpdateCustomer } from "@/hooks/useCustomer";
import CustomerForm from "./components/CustomerForm";
import { getCustomerColumns } from "./components/CustomerHeader";

export default function CustomerMockApiHeader() {
    const { data: customer = [], isLoading,isFetching } = useCustomer();
    const addCustomer = useAddCustomer();
    const updateCustomer = useUpdateCustomer();
    const deleteCustomer = useDeleteCustomer();

    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: "", address: "", gst_no: "", phone: "", email: "", doctor_name: "", prescription_no: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 🟢 Add or Update
    const handleSubmit = () => {
        if (editMode) {
            updateCustomer.mutate(
                { id: formData.customer_id, data: formData },
                {

                    onSuccess: () => setOpen(false),
                }
            );
        } else {
            addCustomer.mutate(formData, {
                onSuccess: () => setOpen(false),
            });
        }
    };



    // ✏️ Edit Handler

    const handleEdit = (row) => {

        console.log("row", row);

        setFormData(row);
        setEditMode(true);
        setOpen(true);
    };

    // ❌ Delete Handler
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteCustomer.mutate(id);
        }
    };


  


    // ✅ pass handlers to columns (so edit/delete buttons work)
    const columns = getCustomerColumns(handleEdit, handleDelete);

    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <h2 className="text-xl font-bold text-blue-700 tracking-wide">
                    Customer List
                </h2>
                <Button variant="contained" color="primary" onClick={() => {
                    // 🧹 Clear previous data before opening
                    setFormData({
                        customer_name: "", address: "", gst_no: "", phone: "", email: "", doctor_name: "", prescription_no: ""
                    });
                    setEditMode(false);
                    setOpen(true);
                }}>
                    Add Customer
                </Button>
            </div>


            <BasicTable columns={columns} data={customer} loading={isLoading || isFetching}/>


            <CustomerForm
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditMode(false);
                }}
                onSubmit={handleSubmit}
                formData={formData}
                onChange={handleChange}
                editMode={editMode}
            />
        </>
    );
}
