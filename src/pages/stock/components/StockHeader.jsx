import { formatToKeralaDateTime } from "@/lib/dateTime";
import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getStockColumns = (onEdit, onDelete) => [
    {
        header: "Id",
        accessorKey: "stock_id"
    },
      {
        header: "batch_no",
        accessorKey: "batch_no"
    },
      {
        header: "expiry_date",
        accessorKey: "expiry_date",
         cell: ({ row }) => formatToKeralaDateTime(row.original.expiry_date),
    },

    {
        header: "sale_rate",
        accessorKey: "sale_rate",
    },
    {
        header: "qty_in_stock",
        accessorKey: "qty_in_stock"
    },
    {
        header: "purchase_rate",
        accessorKey: "purchase_rate"
    },
      {
        header: "mrp",
        accessorKey: "mrp"
    },

    {
        header: "gst_percent",
        accessorKey: "gst_percent",
    },
   
    
  {
        header: "store_id",
        accessorKey: "store_id",
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