import { IconButton } from "@mui/material";
import { Edit, Trash2 as Delete } from "lucide-react";

export const getCategoryColumns = (onEdit, onDelete) => [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Code",
    accessorKey: "code",
  },
  {
    header: "Type",
    accessorKey: "type",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (info) => (
      <span
        style={{
          color:
            info.getValue() === "Active"
              ? "green"
              : info.getValue() === "Inactive"
              ? "gray"
              : "black",
          fontWeight: 500,
        }}
      >
        {info.getValue()}
      </span>
    ),
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <div style={{ display: "flex", gap: "4px" }}>
        <IconButton
          color="primary"
          size="small"
          onClick={() => onEdit(row.original)}
        >
          <Edit size={18} />
        </IconButton>
        <IconButton
          color="error"
          size="small"
          onClick={() => onDelete(row.original.id)}
        >
          <Delete size={18} />
        </IconButton>
      </div>
    ),
  },
];
