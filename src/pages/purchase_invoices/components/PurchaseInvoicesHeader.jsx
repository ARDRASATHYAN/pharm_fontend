import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getPurchaseInvoiceColumns = (onEdit, onDelete) => [
    {
        header: "Id",
        accessorKey: "item_id"
    },
      {
        header: "invoice_no",
        accessorKey: "invoice_no"
    },
      {
        header: "barcode",
        accessorKey: "barcode"
    },

    {
        header: "name",
        accessorKey: "name",
    },
    {
        header: "brand",
        accessorKey: "brand"
    },
    {
        header: "generic_name",
        accessorKey: "generic_name"
    },
      {
        header: "hsn_id",
        accessorKey: "hsn_id"
    },

    {
        header: "is_active",
        accessorKey: "is_active",
    },
    {
        header: "pack_size",
        accessorKey: "pack_size"
    },
    {
        header: "schedule_id",
        accessorKey: "schedule_id"
    },
    {
        header: "manufacturer",
        accessorKey: "manufacturer"
    },
    {
        header: "item_type",
        accessorKey: "item_type"
    },
  // {
  //       header: "created_at",
  //       accessorKey: "created_at"
  //   },
  

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
        onClick={() => onDelete(row.original.schedule_id)}
        sx={{ padding: "4px" }}
      >
        <Delete size={16} />
      </IconButton>
    </div>
  ),
}



];