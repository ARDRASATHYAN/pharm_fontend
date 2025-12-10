import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getSalesInvoiceColumns = (onEdit, onDelete) => [
    {
        header: "Id",
        accessorKey: "sale_id"
    },
      {
        header: "bill_no",
        accessorKey: "bill_no"
    },
      {
        header: "bill_date",
        accessorKey: "bill_date"
    },
       {
        header: "doctor_name",
        accessorKey: "customer.doctor_name"||'doctor_name',
    },
    {
        header: "prescription_no",
        accessorKey: "customer.prescription_no"||"prescription_no"
    },
     {
        header: "customer_id",
        accessorKey: "customer_id"
    },
      {
        header: "store_id",
        accessorKey: "store_id"
    },

    {
        header: "total_amount",
        accessorKey: "total_amount",
    },
    {
        header: "total_gst",
        accessorKey: "total_gst"
    },
      {
        header: "total_discount",
        accessorKey: "total_discount"
    },

  {
        header: "net_amount",
        accessorKey: "net_amount"
    },
   
    
   
   
  // {
  //       header: "created_at",
  //       accessorKey: "created_at"
  //   },
  

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
        onClick={() => onDelete(row.original.purchase_id)}
        sx={{ padding: "4px" }}
      >
        <Delete size={16} />
      </IconButton>
    </div>
  ),
}



];