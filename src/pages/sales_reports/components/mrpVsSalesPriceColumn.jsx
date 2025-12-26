// src/components/sales/components/mrpVsSalesPriceColumn.js

export const getMrpVsSalepriceColumns = () => [
    { header: "Item Name", accessorKey: "item_name" },
    { header: "Batch", accessorKey: "batch_no" },
    { header: "Pack Size", accessorKey: "pack_size" },

    { header: "MRP / Pack", accessorKey: "mrp_pack" },
    { header: "MRP / Unit", accessorKey: "mrp_unit" },

    { header: "sale / discount", accessorKey: "sales_deiscount" },
    { header: "Sale / Pack", accessorKey: "sale_pack" },
    { header: "Sale / Unit", accessorKey: "sale_unit" },

    { header: "Purchase / Pack", accessorKey: "purchase_pack" },
    { header: "Purchase / Unit", accessorKey: "purchase_unit" },
];
