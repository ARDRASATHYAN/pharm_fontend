// src/components/purchase/PurchaseInvoiceMockApiHeader.jsx
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { useSaleItems, useSalesInvoiceList } from "@/hooks/useSalesInvoice";
import { getGstSalesColumns } from "./components/GstSalesHeader";


export default function GstSalesReport() {
 
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
  
  
 
    const { data: salesinvoice = {}, isLoading } = useSalesInvoiceList({
      search: filters.search,
      page: Number(filters.page),
      perPage: Number(filters.perPage),
    });
   
  
   
   
    const handlePageChange = (page) => setFilters(prev => ({ ...prev, page: Number(page) || 1 }));
  
    const columns = getGstSalesColumns();

  
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
         GST Sales Report
        </h2>
       
      </div>

  <BasicTable
        columns={columns}
        data={salesinvoice?.data || []}
        loading={isLoading}
        pagination={{
          page: salesinvoice?.page || 1,
          perPage: filters.perPage,
          totalPages: salesinvoice?.totalPages || 1,
          total: salesinvoice?.total || 0,
        }}
        rowPadding="py-2" 
        onPageChange={handlePageChange}
      />
   
    </>
  );
}
