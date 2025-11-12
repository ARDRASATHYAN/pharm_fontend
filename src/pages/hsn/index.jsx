import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DataTable from "../../components/commen/Datatable";
import { getHsnColumns } from "./components/HsnHeader";
import HsnForm from "./components/HsnForm";
import BasicTable from "@/components/commen/BasicTable";
import { useAddHsn, useDeleteHsn, useHsn, useUpdateHsn } from "@/hooks/useHsn";


export default function HsnMockApiHeader() {
 const { data: hsns = [], isLoading,isFetching } = useHsn();
   const addHsn = useAddHsn();
   const updateHsn = useUpdateHsn();
   const deleteHsn = useDeleteHsn();
 
   const [open, setOpen] = useState(false);
   const [editMode, setEditMode] = useState(false);
   const [formData, setFormData] = useState({
     hsn_code:"", description:"", gst_percent:""
   });
 
   const handleChange = (e) => {
     const { name, value } = e.target;
     setFormData((prev) => ({ ...prev, [name]: value }));
   };
 
   // 🟢 Add or Update
   const handleSubmit = () => {
     if (editMode) {
       updateHsn.mutate(
         { id: formData.hsn_id, data: formData },
         {
 
           onSuccess: () => setOpen(false),
         }
       );
     } else {
       addHsn.mutate(formData, {
         onSuccess: () => setOpen(false),
       });
     }
   };
 
 
   
   // ✏️ Edit Handler
 
   const handleEdit = (row) => {
 
     console.log("row",row);
     
     setFormData(row);
     setEditMode(true);
     setOpen(true);
   };
 
   // ❌ Delete Handler
   const handleDelete = (id) => {
     if (window.confirm("Are you sure you want to delete this user?")) {
       deleteHsn.mutate(id);
     }
   };
 
 
  
 

  // ✅ pass handlers to columns (so edit/delete buttons work)
  const columns = getHsnColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
       <h2 className="text-xl font-bold text-blue-700 tracking-wide">
            HSN List
          </h2>
        <Button variant="contained" color="primary" onClick={() => {
    // 🧹 Clear previous data before opening
    setFormData({
     hsn_code:"", description:"", gst_percent:""
    });
    setEditMode(false);
    setOpen(true);
  }}>
          Add HSN
        </Button>
      </div>


  <BasicTable columns={columns} data={hsns} loading={isLoading || isFetching}/>


      <HsnForm
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
