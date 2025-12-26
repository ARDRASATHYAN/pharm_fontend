export const getProfitReportColumns = () => [
  {
    header: "Bill No",
    accessorKey: "invoice.bill_no",
  },
  {
    header: "Date",
    accessorKey: "invoice.bill_date",
  },
  {
    header: "Item",
    accessorKey: "item.name",
  },
  {
    header: "Batch",
    accessorKey: "batch_no",
  },
  {
    header: "Qty",
    accessorKey: "qty",
  },
  {
    header: "Sale Rate",
    accessorKey: "sale_rate",
  },
  {
    header: "Sale Value",
    accessorKey: "sale_value",
  },
  {
    header: "Cost Price",
    accessorKey: "cost_price",
  },
{
 header: "Cost Value",
    accessorKey: "cost_value",   
},
  {
    header: "Profit",
    accessorKey: "profit_value",
  },
  {
    header: "Margin %",
    accessorKey: "margin_percent",
  },
];
