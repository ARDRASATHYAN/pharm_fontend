import { IconButton } from "@mui/material";
import { Delete, Edit } from "lucide-react";



export const getMedicineColumns = (onEdit, onDelete) => [
    {
        header: "medicineId",
        accessorKey: "medicineId"
    },
    {
        header: "name",
        accessorKey: "name",
    },
    {
        header: "category",
        accessorKey: "category"
    },
    {
        header: "manufacturer",
        accessorKey: "manufacturer",
    },
    {
        header: "batchNo",
        accessorKey: "batchNo",
    },
    {
        header: "Expiry",
        accessorKey: "Expiry",
    },

    // {
    //     header: "manufactureDate",
    //     accessorKey: "manufactureDate",
    // },
    {
        header: "quantity",
        accessorKey: "quantity",
    },
    // {
    //     header: "unitPrice",
    //     accessorKey: "unitPrice",
    // },
    {
        header: "sellingPrice",
        accessorKey: "sellingPrice",
    },

    {
        header: "rackNo",
        accessorKey: "rackNo",
    },
    // {
    //     header: "supplier",
    //     accessorKey: "supplier",
    // },
    // {
    //     header: "createdBy",
    //     accessorKey: "createdBy",
    // },
    // {
    //     header: "updatedAt",
    //     accessorKey: "updatedAt",
    // },
    {
        header: "status",
        accessorKey: "status",
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