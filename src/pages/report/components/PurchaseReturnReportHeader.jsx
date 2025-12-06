// src/pages/reports/components/PurchaseReturnReportHeader.js

export const getPurchaseReturnReportColumns = () => [
  {
    header: "Return Date",
    accessorKey: "return_date",
  },

  {
    header: "Invoice No",
    accessorFn: (row) => row.purchase?.invoice_no || "",
    id: "invoice_no",
  },
  {
    header: "Invoice Date",
    accessorFn: (row) => row.purchase?.invoice_date || "",
    id: "invoice_date",
  },

  // --- Backend sends only store_id ---
  {
    header: "Store",
    accessorFn: (row) => row.store_id || "",
    id: "store",
  },

  // --- Backend sends created_by ---
  {
    header: "Returned By",
    accessorFn: (row) => row.created_by || "",
    id: "returned_by",
  },

  // --- Item Level Data ---
  {
    header: "Batch No",
    accessorFn: (row) => row.purchaseReturnItems?.[0]?.batch_no || "",
    id: "batch_no",
  },
  {
    header: "Qty",
    accessorFn: (row) => row.purchaseReturnItems?.[0]?.qty || "",
    id: "qty",
  },
  {
    header: "Rate",
    accessorFn: (row) => row.purchaseReturnItems?.[0]?.rate || "",
    id: "rate",
  },
  {
    header: "Amount",
    accessorFn: (row) => row.purchaseReturnItems?.[0]?.amount || "",
    id: "amount",
  },

  {
    header: "Reason",
    accessorKey: "reason",
  },
];
