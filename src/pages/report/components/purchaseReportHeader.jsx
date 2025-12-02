export const getPurchaseReportColumns = () => [
  { header: "Invoice No", accessorKey: "invoice_no" },
  { header: "Invoice Date", accessorKey: "invoice_date" },
  { header: "Store", accessorKey: "store_name" },
  { header: "Supplier", accessorKey: "supplier_name" },

  { header: "Item", accessorKey: "item_name" },
  { header: "Batch", accessorKey: "batch_no" },
  { header: "Expiry", accessorKey: "expiry_date" },

  { header: "Qty", accessorKey: "qty" },
  { header: "Rate", accessorKey: "purchase_rate" },
  { header: "Disc %", accessorKey: "discount_percent" },

  { header: "Taxable Amount", accessorKey: "taxable_amount" },
  { header: "GST %", accessorKey: "gst_percent" },
  { header: "GST Amount", accessorKey: "gst_amount" },

  { header: "Total (With GST)", accessorKey: "line_total_with_gst" }
];
