import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getDrugScheduleColumns = (onEdit, onDelete) => [
    {
        header: "Id",
        accessorKey: "id"
    },
      {
        header: "schedule_code",
        accessorKey: "schedule_code"
    },
      {
        header: "schedule_name",
        accessorKey: "schedule_name"
    },

    {
        header: "description",
        accessorKey: "description",
    },
    {
        header: "requires_prescription",
        accessorKey: "requires_prescription"
    },
    {
        header: "restricted_sale",
        accessorKey: "restricted_sale"
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