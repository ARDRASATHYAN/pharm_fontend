import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getSalesReturnItemColumns = (onEdit, onDelete) => [
    {
        header: "Id",
        accessorKey: "return_item_id"
    },
      {
        header: "return_id",
        accessorKey: "return_id"
    },
       {
        header: "item_id",
        accessorKey: "item_id"
    },
      {
        header: "batch_no",
        accessorKey: "batch_no"
    },

    {
        header: "qty",
        accessorKey: "qty",
    },
    {
        header: "rate",
        accessorKey: "rate"
    },
    {
        header: "amount",
        accessorKey: "amount"
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