import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getCustomerColumns = (onEdit, onDelete) => [
    {
        header: "Id",
        accessorKey: "customer_id"
    },
      {
        header: "customer_name",
        accessorKey: "customer_name"
    },
      {
        header: "phone",
        accessorKey: "phone"
    },

    {
        header: "address",
        accessorKey: "address",
    },
    
    {
        header: "gst_no",
        accessorKey: "gst_no"
    },
      {
        header: "email",
        accessorKey: "email"
    },
    {
        header: "doctor_name",
        accessorKey: "doctor_name"
    },
    {
        header: "prescription_no",
        accessorKey: "prescription_no"
    },

    {
        header: "created_at",
        accessorKey: "created_at",
    },
    
  

   {
  header: "Actions",
  id: "actions",
  cell: ({ row }) => (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      <IconButton
        color="primary"
        size="small"
        onClick={() => onEdit(row.original)}
        sx={{ padding: "4px" }} // reduce default 8px
      >
        <Edit size={16} />
      </IconButton>
      <IconButton
        color="error"
        size="small"
        onClick={() => onDelete(row.original.customer_id)}
        sx={{ padding: "4px" }}
      >
        <Delete size={16} />
      </IconButton>
    </div>
  ),
}



];