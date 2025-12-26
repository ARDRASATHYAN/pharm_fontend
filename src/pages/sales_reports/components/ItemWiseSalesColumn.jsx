// src/components/sales/components/ItemWiseSalesColumn.ts
export const getItemWiseSalesColumns = () => [
  {
    id: "item_id",
    accessorKey: "item_id",   // required for react-table
    header: "Item ID",
  },
  {
    id: "qty",
    accessorKey: "qty",
    header: "Qty Sold",
    cell: (info) => info.getValue(),
    meta: { align: "right" },
  },
  {
    id: "taxable",
    accessorKey: "taxable",
    header: "Taxable Value",
    cell: (info) => Number(info.getValue()).toFixed(2),
    meta: { align: "right" },
  },
  {
    id: "gst_percent",
    accessorKey: "gst_percent",
    header: "GST %",
    meta: { align: "right" },
  },
  {
    id: "gst",
    accessorKey: "gst",
    header: "GST Amount",
    cell: (info) => Number(info.getValue()).toFixed(2),
    meta: { align: "right" },
  },
  {
    id: "gross",
    accessorKey: "gross",
    header: "Gross Sales",
    cell: (info) => Number(info.getValue()).toFixed(2),
    meta: { align: "right" },
  },
];
