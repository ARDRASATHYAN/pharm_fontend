export const getDeadStockColumns = () => [
    {
        header: "Item Id",
        accessorKey: "item_id",
    },
    {
        header: "Item Name",
        accessorKey: "name",
    },
    {
        header: "Batch",
        accessorKey: "batch_no",
    },
    {
        header: "Expiry",
        accessorKey: "expiry_date",
    },
    {
        header: "Qty",
        accessorKey: "qty_in_stock",
    },
    {
        header: "Cost Price",
        accessorKey: "cost_price",
    },
    {
        header: "Stock Value",
        accessorKey: "stock_value",
    },
    {
        header: "Last S-Date",
        accessorKey: "last_sale_date",
    },
    {
        header: "Days Since Last Sale",
        accessorKey: "days_since_last_sale",
    },
    
];
