import apiClient from "./apiClient";


const reportService = {

  // src/hooks/useReport.js or wherever your service is
getpurchasereport: async (filters = {}) => {
  const { data } = await apiClient.get("/purchase/report", { params: filters });

  // Flatten items so each item becomes a row in the table
  const flat = data.data.flatMap(purchase =>
    purchase.items.map(item => ({
      purchase_id: purchase.purchase_id,
      invoice_no: purchase.invoice_no,
      invoice_date: purchase.invoice_date,
      store_name: purchase.store?.store_name || "",
      supplier_name: purchase.supplier?.supplier_name || "",
      item_name: item.item?.name || "",
      batch_no: item.batch_no || "",
      expiry_date: item.expiry_date || "",
      qty: item.qty,
      purchase_rate: item.purchase_rate,
      discount_percent: item.discount_percent,
      taxable_amount: item.taxable_amount,
      gst_percent: item.gst_percent,
      gst_amount: Number(item.cgst || 0) + Number(item.sgst || 0) + Number(item.igst || 0),
      line_total_with_gst: item.total_amount,
    }))
  );

  // 🔥 Important: compute frontend pagination on flattened rows
  const totalFlat = flat.length;
  const perPage = Number(filters.perPage) || 10;
  const page = Number(filters.page) || 1;

  // Slice manually for pagination
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginatedRows = flat.slice(start, end);

  return {
    data: paginatedRows,
    total: totalFlat,
    page,
    totalPages: Math.ceil(totalFlat / perPage),
  };
},






     getsalereport: async (filters = {}) => {
      const { data } = await apiClient.get("/reports/sale",{params: filters} );
      return data.data;
    },

    getPurchaseReturnReport: async (filters = {}) => {
      const { data } = await apiClient.get("/reports/purchase-return",{params: filters} );
      return data.data;
    },

     getSalesReturnReport: async (filters = {}) => {
      const { data } = await apiClient.get("/reports/sale-return",{params: filters} );
      return data.data;
    },
 
};



export default reportService;
