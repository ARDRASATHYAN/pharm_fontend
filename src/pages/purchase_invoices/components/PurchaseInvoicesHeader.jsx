export const getPurchaseInvoiceColumns = (onEdit, onDelete) => [
  { header: "Invoice No", accessorKey: "invoice_no" },
  { header: "Invoice Date", accessorKey: "invoice_date" },
  {
    header: "Store",
    accessorFn: (row) => row.store?.store_name || "",
    id: "store_name",
  },
  {
    header: "Supplier",
    accessorFn: (row) => row.supplier?.supplier_name || "",
    id: "supplier_name",
  },
  // {
  //   header: "Item",
  //   accessorFn: (row) => row.items?.map(i => i.item?.name).join(", ") || "",
  //   id: "item_name",
  // },
  // {
  //   header: "Batch",
  //   accessorFn: (row) => row.items?.map(i => i.batch_no).join(", ") || "",
  //   id: "batch_no",
  // },
  // {
  //   header: "Qty",
  //   accessorFn: (row) => row.items?.map(i => i.qty).join(", ") || "",
  //   id: "qty",
  // },
  // {
  //   header: "Rate",
  //   accessorFn: (row) => row.items?.map(i => i.purchase_rate).join(", ") || "",
  //   id: "purchase_rate",
  // },
  { header: "Total Amount", accessorKey: "total_amount" },
  { header: "Net Amount", accessorKey: "net_amount" },
  { header: "Total GST", accessorKey: "total_gst" },
  { header: "Total Discount", accessorKey: "total_discount" },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => (
      <div style={{ display: "flex", gap: 4 }}>
        <button onClick={() => onEdit(row.original)}>Edit</button>
        <button onClick={() => onDelete(row.original.purchase_id)}>Delete</button>
      </div>
    ),
  },
];
