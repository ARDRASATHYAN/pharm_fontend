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

  return {
    data: flat,             // frontend expects 'data' array
    total: data.total || 0, // total rows for pagination
    page: data.page || 1,   // current page
    totalPages: data.pages || 1, // total pages
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
