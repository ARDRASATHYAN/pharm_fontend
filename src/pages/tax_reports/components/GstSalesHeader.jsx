
export const getGstSalesColumns = () => [
    {
        header: "Id",
        accessorKey: "sale_id"
    },
      {
        header: "Bill No",
        accessorKey: "bill_no"
    },
      {
        header: "Bill Date",
        accessorKey: "bill_date"
    },
     {
        header: "Customer Name",
        accessorKey: "customer.customer_name"
    },
      {
        header: "Store id",
        accessorKey: "store_id"
    },
    {
        header: "Total Discount",
        accessorKey: "total_discount"
    },

    {
        header: "Taxable Amount",
        accessorKey: "total_amount",
    },
    {
        header: "Total GST",
        accessorKey: "total_gst"
    },

  {
        header: "Net Amount",
        accessorKey: "net_amount"
    },
  



];