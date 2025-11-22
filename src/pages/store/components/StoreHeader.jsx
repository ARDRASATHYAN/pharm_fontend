import { formatToKeralaDateTime } from "@/lib/dateTime";
import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getStoreColumns = (onEdit, onDelete) => [
  {
    header: "storeId",
    accessorKey: "store_id"
  },
  {
    header: "store_name",
    accessorKey: "store_name"
  },
  {
    header: "address",
    accessorKey: "address"
  },

  {
    header: "city",
    accessorKey: "city",
  },
  {
    header: "state",
    accessorKey: "state"
  },
  {
    header: "gst_no",
    accessorKey: "gst_no",
  },
  {
    header: "email",
    accessorKey: "email",
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
          sx={{ padding: "4px" }}
        >
          <Edit size={16} />
        </IconButton>
        <IconButton
          color="error"
          size="small"
          onClick={() => onDelete(row.original.store_id)}
          sx={{ padding: "4px" }}
        >
          <Delete size={16} />
        </IconButton>
      </div>
    ),
  }



];