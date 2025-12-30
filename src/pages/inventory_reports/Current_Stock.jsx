// src/components/sales/CurrentStockReport.jsx
import React, { useEffect, useLayoutEffect, useState } from "react";
import BasicTable from "@/components/commen/BasicTable";
import { useCurrentStock } from "@/hooks/useStock";
import { getCurrentStockColumns } from "./components/currentStockColumns";

export default function CurrentStockReport() {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    perPage: 10,
  });

  // Dynamically calculate perPage based on screen height
  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 180; // header + filters + padding
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

  // Fetch current stock data
  const { data: stockData = {}, isLoading } = useCurrentStock({
      store_id: 1,
    page: Number(filters.page) || 1,
    perPage: Number(filters.perPage) || 10,
  
  });

  const handlePageChange = (page) =>
    setFilters(prev => ({ ...prev, page: Number(page) || 1 }));

  const columns = getCurrentStockColumns();
   const getRowClassName = (row) => {
    if (row.expired || row.near_expiry) return "text-red-600"; // expired or near expiry → red
    if (row.low_stock) return "text-orange-600";               // low stock → orange
    return "text-gray-800";                                    // normal
  };

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
          Current Stock Report
        </h2>
      </div>

      <BasicTable
  columns={columns}
  data={stockData?.data || []}
  loading={isLoading}
  pagination={{
    page: stockData?.pagination?.page || 1,
    perPage: filters.perPage, // frontend perPage
    totalPages: stockData?.pagination?.totalPages || 1,
    total: stockData?.pagination?.total || 0,
  }}
 getRowClassName={getRowClassName} 
  rowPadding="py-2"
  onPageChange={handlePageChange}
/>

    </>
  );
}
