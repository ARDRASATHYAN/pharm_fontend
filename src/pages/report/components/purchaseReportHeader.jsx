export const getPurchaseReportColumns = () => [
  { header: "Invoice No",
   accessorFn: (row) => row.purchaseInvoice?.invoice_no || "",
     accessorKey: "invoice_no" },
  { header: "Invoice Date",
    accessorFn: (row) => row.purchaseInvoice?.invoice_date || "",
    accessorKey: "invoice_date" },

  { header: "Store",
    accessorFn: (row) => row.purchaseInvoice?.store?.store_name || "",

    accessorKey: "store_name" },
  { header: "Supplier",
      accessorFn: (row) => row.purchaseInvoice?.supplier?.supplier_name || "",
     accessorKey: "supplier_name" },

  { header: "Item",
      accessorFn: (row) => row.item?.name || "",
     accessorKey: "name" },
  { header: "Batch", accessorKey: "batch_no" },
  { header: "Expiry", accessorKey: "expiry_date" },

  { header: "Qty", accessorKey: "qty" },
  { header: "Rate", accessorKey: "purchase_rate" },
  { header: "Disc %", accessorKey: "discount_percent" },

  { header: "Taxable Amount", accessorKey: "taxable_amount" },
  { header: "GST %", accessorKey: "gst_percent" },
 {
  header: "GST Amount",
  accessorFn: (row) => {
    const cgst = parseFloat(row.cgst) || 0;
    const sgst = parseFloat(row.sgst) || 0;
    return (cgst + sgst).toFixed(2);
  },
},


  { header: "Total (With GST)", accessorKey: "total_amount" }
];
