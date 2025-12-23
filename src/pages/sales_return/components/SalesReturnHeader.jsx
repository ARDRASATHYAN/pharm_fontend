import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getSalesReturnColumns = (onEdit, onDelete,onItem) => [
    {
        header: "Id",
        accessorKey: "return_id"
    },
      {
        header: "sale_id",
        accessorKey: "sale_id"
    },
      {
        header: "store_id",
        accessorKey: "store_id"
    },

    {
        header: "return_date",
        accessorKey: "return_date",
    },
    {
        header: "reason",
        accessorKey: "reason"
    },
    {
        header: "total_amount",
        accessorKey: "total_amount"
    },
      {
        header: "created_by",
        accessorKey: "created_by"
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
        onClick={() => onDelete(row.original.return_id)}
        sx={{ padding: "4px" }}
      >
        <Delete size={16} />
      </IconButton>

      <IconButton
        color="error"
        size="small"
        onClick={() => onItem(row.original.return_id)}
        sx={{ padding: "4px" }}
      >
        <Delete size={16} />
      </IconButton>
    </div>
  ),
}



]