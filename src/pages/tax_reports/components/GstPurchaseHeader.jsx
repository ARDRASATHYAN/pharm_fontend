
export const getGstPurchaseColumns = () => [
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
  {
    header: "GST No",
    accessorFn: (row) => row.supplier?.gst_no || "",
    id: "gst_no",
  },
  { header: "Total Discount", accessorKey: "total_discount" },
  { header: "Taxable Amount", accessorKey: "total_amount" },
   { header: "Total GST", accessorKey: "total_gst" },
  { header: "Net Amount", accessorKey: "net_amount" },
 
  



];