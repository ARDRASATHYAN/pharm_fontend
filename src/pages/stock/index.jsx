import React, { useState, useLayoutEffect, useEffect } from "react";
import { Box, TextField } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { usestock } from "@/hooks/useStock";
import { getStockColumns } from "./components/StockHeader";

export default function StockMockApiHeader() {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    perPage: 10,
  });

  // Dynamically calculate perPage based on screen height
  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 180; // filters + table header
    const rowHeight = 34;      // table row height
    const rows = Math.floor((screenHeight - headerHeight) / rowHeight);
    setFilters(prev => ({ ...prev, perPage: Math.max(5, rows) }));
  };

  useLayoutEffect(() => {
    adjustRowsByHeight();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", adjustRowsByHeight);
    return () => window.removeEventListener("resize", adjustRowsByHeight);
  }, []);

  // Fetch stock data
  const { data: stockData = {}, isLoading } = usestock({
    search: filters.search,
    page: Number(filters.page) || 1,
    perPage: Number(filters.perPage) || 10,
  });

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page: Number(page) || 1 }));
  };

  const columns = getStockColumns();

  return (
    <>
      <h2 className="text-xl font-bold text-blue-700 tracking-wide mb-2">
        Stock
      </h2>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          size="small"
          placeholder="Search by invoice, supplier..."
          value={filters.search}
          onChange={handleSearchChange}
        />
      </Box>

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
  onPageChange={handlePageChange}
/>

    </>
  );
}
