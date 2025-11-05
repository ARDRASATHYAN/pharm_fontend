import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getHsnColumns = (onEdit, onDelete) => [
    {
        header: "HsnId",
        accessorKey: "id"
    },
      {
        header: "hsn_code",
        accessorKey: "hsn_code"
    },
      {
        header: "description",
        accessorKey: "description"
    },

    {
        header: "gst_rate",
        accessorKey: "gst_rate",
    },
    {
        header: "created_at",
        accessorKey: "created_at"
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