import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getUserColumns = (onEdit, onDelete) => [
    {
        header: "userId",
        accessorKey: "id"
    },
    {
        header: "username",
        accessorKey: "username",
    },
    {
        header: "full_name",
        accessorKey: "full_name"
    },
    {
        header: "role",
        accessorKey: "role",
    },
    {
        header: "is_active",
        accessorKey: "is_active",
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
        onClick={() => onDelete(row.original.id)}
        sx={{ padding: "4px" }}
      >
        <Delete size={16} />
      </IconButton>
    </div>
  ),
}



];