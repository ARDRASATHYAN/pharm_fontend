import { formatToKeralaDateTime } from "@/lib/dateTime";
import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";

export const getExcessStockColumns = (onEdit, onDelete) => [
  {
    header: "ID",
    accessorKey: "excess_id",
  },

  {
    header: "Store",
    accessorFn: (row) => row.store?.store_name || "-",
  },

  {
    header: "Item",
    accessorFn: (row) => row.item?.name || "-",
  },

  {
    header: "Batch No",
    accessorKey: "batch_no",
  },

  {
    header: "Qty",
    accessorKey: "qty",
  },

  {
    header: "Reason",
    accessorKey: "reason",
  },

  {
    header: "Entry Date",
    accessorKey: "entry_date",
    cell: ({ row }) => formatToKeralaDateTime(row.original.entry_date),
  },

  {
    header: "Created By",
    accessorFn: (row) => row.user?.username || "-",
  },

  {
    header: "Created At",
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
          onClick={() => onDelete(row.original.excess_id)} // FIXED
          sx={{ padding: "4px" }}
        >
          <Delete size={16} />
        </IconButton>
      </div>
    ),
  },
];
