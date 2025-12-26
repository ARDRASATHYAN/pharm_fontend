// src/components/purchase/PurchaseInvoiceMockApiHeader.jsx
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { getGstPurchaseColumns } from "./components/GstPurchaseHeader";
import { usepurchaseinvoice } from "@/hooks/usePurchaseInvoice";


export default function GstPurchaseReport() {
 
    const [filters, setFilters] = useState({
      search: "",
      page: 1,
      perPage: 10,
    });
  
    // Dynamically calculate perPage based on screen height
    const adjustRowsByHeight = () => {
      const screenHeight = window.innerHeight;
      const headerHeight = 180; 
      const rowHeight = 34;
      const rows = Math.floor((screenHeight - headerHeight) / rowHeight);
      setFilters(prev => ({ ...prev, perPage: Math.max(5, rows), page: 1 }));
    };
  
    useLayoutEffect(() => {
      adjustRowsByHeight();
    }, []);
  
    useEffect(() => {
      window.addEventListener("resize", adjustRowsByHeight);
      return () => window.removeEventListener("resize", adjustRowsByHeight);
    }, []);
  
  
 
    const { data: purchaseData = {}, isLoading } = usepurchaseinvoice({
      search: filters.search,
      page: Number(filters.page),
      perPage: Number(filters.perPage),
    });
  
   
   
    const handlePageChange = (page) => setFilters(prev => ({ ...prev, page: Number(page) || 1 }));
  
    const columns = getGstPurchaseColumns();

  
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
         GST Purchase Report
        </h2>
       
      </div>

  <BasicTable
        columns={columns}
        data={purchaseData?.data || []}
        loading={isLoading}
        pagination={{
          page: purchaseData?.page || 1,
          perPage: filters.perPage,
          totalPages: purchaseData?.totalPages || 1,
          total: purchaseData?.total || 0,
        }}
        rowPadding="py-2" 
        onPageChange={handlePageChange}
      />
   
    </>
  );
}
