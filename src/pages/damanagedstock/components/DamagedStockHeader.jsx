import { formatToKeralaDateTime } from "@/lib/dateTime";
import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getDamagedStockColumns = (onEdit, onDelete) => [
    {
        header: "Id",
        accessorKey: "damaged_id"
    },
      {
        header: "store_id",
        accessorKey: "store_id"
    },
      {
        header: "item_id",
        accessorKey: "item_id"
    },
       {
        header: "batch_no",
        accessorKey: "batch_no",
    },
    {
        header: "qty",
        accessorKey: "qty"
    },
     {
        header: "reason",
        accessorKey: "reason"
    },
      {
        header: "entry_date",
        accessorKey: "entry_date",
         cell: ({ row }) => formatToKeralaDateTime(row.original.entry_date),
    },

    {
        header: "created_by",
        accessorKey: "created_by",
    },
    {
        header: "created_at",
        accessorKey: "created_at",
         cell: ({ row }) => formatToKeralaDateTime(row.original.created_at),
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