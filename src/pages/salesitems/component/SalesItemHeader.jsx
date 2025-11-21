import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getSalesItemColumns = (onEdit, onDelete) => [
    {
        header: "Id",
        accessorKey: "sale_item_id"
    },
      {
        header: "batch_no",
        accessorKey: "batch_no"
    },
      {
        header: "qty",
        accessorKey: "qty"
    },

    {
        header: "rate",
        accessorKey: "rate",
    },
    {
        header: "gst_percent",
        accessorKey: "gst_percent"
    },
    {
        header: "discount_percent",
        accessorKey: "discount_percent"
    },
      {
        header: "total_amount",
        accessorKey: "total_amount"
    },
  {
        header: "sale_id",
        accessorKey: "sale_id"
    },
    
     {
        header: "item_id",
        accessorKey: "item_id"
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
        onClick={() => onDelete(row.original.purchase_id)}
        sx={{ padding: "4px" }}
      >
        <Delete size={16} />
      </IconButton>
    </div>
  ),
}



];