import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { getDrugScheduleColumns } from "./components/DrugScheduleHeader";
import DrugScheduleForm from "./components/DrugScheduleForm";
import BasicTable from "@/components/commen/BasicTable";
import { useAddDrugSchedule, useDeleteDrugSchedule, useDrugSchedule, useUpdateDrugSchedule } from "@/hooks/useDrugSchedule";

export default function DrugScheduleMockApiHeader() {
  const { data:  drugschedule= [], isLoading } = useDrugSchedule();
     const addDrugSchedule = useAddDrugSchedule();
     const updateDrugSchedule = useUpdateDrugSchedule();
     const deleteDrugSchedule = useDeleteDrugSchedule();
   
     const [open, setOpen] = useState(false);
     const [editMode, setEditMode] = useState(false);
     const [formData, setFormData] = useState({
       schedule_code:"", schedule_name:"", description:"", requires_prescription:"", restricted_sale:""
     });
   
     const handleChange = (e) => {
       const { name, value } = e.target;
       setFormData((prev) => ({ ...prev, [name]: value }));
     };
   
     // 🟢 Add or Update
     const handleSubmit = () => {
       if (editMode) {
         updateDrugSchedule.mutate(
           { id: formData.schedule_id, data: formData },
           {
   
             onSuccess: () => setOpen(false),
           }
         );
       } else {
         addDrugSchedule.mutate(formData, {
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
         deleteDrugSchedule.mutate(id);
       }
     };
   
   
     if (isLoading) return <p>Loading hsns...</p>;
   

  // ✅ pass handlers to columns (so edit/delete buttons work)
  const columns = getDrugScheduleColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
          Drug Schedule List
        </h2>
        <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
          Add Drug Schedule
        </Button>
      </div>


      <BasicTable columns={columns} data={drugschedule} />


      <DrugScheduleForm
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
