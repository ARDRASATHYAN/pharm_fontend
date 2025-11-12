import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getPurchaseInvoiceColumns = (onEdit, onDelete) => [
    {
        header: "Id",
        accessorKey: "purchase_id"
    },
      {
        header: "invoice_no",
        accessorKey: "invoice_no"
    },
      {
        header: "invoice_date",
        accessorKey: "invoice_date"
    },

    {
        header: "store_id",
        accessorKey: "store_id",
    },
    {
        header: "created_by",
        accessorKey: "created_by"
    },
    {
        header: "total_amount",
        accessorKey: "total_amount"
    },
      {
        header: "total_discount",
        accessorKey: "total_discount"
    },

    {
        header: "total_gst",
        accessorKey: "total_gst",
    },
   
    {
        header: "supplier_id",
        accessorKey: "supplier_id"
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