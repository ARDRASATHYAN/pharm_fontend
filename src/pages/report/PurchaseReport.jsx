import React, { useState, useEffect, useLayoutEffect } from "react";
import { Box, TextField } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import ReportFilter from "./components/reportFilter";
import { usePurchaseReport } from "@/hooks/useReport";
import { getPurchaseReportColumns } from "./components/purchaseReportHeader";

export default function PurchaseReport() {
  // ----------------------------
  // Filters
  // ----------------------------
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    search: "",
  });

  // ----------------------------
  // Pagination (backend expects 1-index)
  // ----------------------------
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  // ----------------------------
  // Auto adjust rows by screen height
  // ----------------------------
  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 180;
 const row = document.querySelector(".data-row"); // your row class
  const rowHeight = row ? row.clientHeight : 50;   // fallback 50px

    const rows = Math.floor((screenHeight - headerHeight) / rowHeight);
    const safeRows = Math.max(5, rows);

    setPagination((prev) => ({
      ...prev,
      perPage: safeRows,
      page: 1,
    }));
  };

  useLayoutEffect(() => {
    adjustRowsByHeight();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", adjustRowsByHeight);
    return () => window.removeEventListener("resize", adjustRowsByHeight);
  }, []);

  // ----------------------------
  // Fetch report data
  // ----------------------------
  const { data: report, isLoading } = usePurchaseReport({
    ...filters,
    page: pagination.page,       // backend 1-indexed
    perPage: pagination.perPage,
  });

  const rows = Array.isArray(report?.data) ? report.data : [];
  const totalPages = report?.totalPages || 1;
  const totalRecords = report?.total || 0;

  // ----------------------------
  // Filters & Search
  // ----------------------------
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // reset page on filter change
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // ----------------------------
  // Pagination handlers
  // ----------------------------
  const handlePageChange = (pageIndex) => {
    // Table gives 0-based → Convert to backend 1-based
    setPagination((prev) => ({ ...prev, page: pageIndex }));
  };

  const handlePerPageChange = (perPage) => {
    setPagination({ page: 1, perPage });
  };

  const columns = getPurchaseReportColumns();

  return (
    <>
      <h2 className="text-xl font-bold text-blue-700 tracking-wide p-0">
        Purchase Report
      </h2>

      {/* TOP BAR */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        {/* LEFT: Search */}
        <TextField
          size="small"
          placeholder="Search item / supplier / invoice"
          value={filters.search}
          onChange={handleSearchChange}
        />

        {/* RIGHT: Filters */}
        <Box display="flex" gap={2} alignItems="center">
          <ReportFilter filters={filters} onFilterChange={handleFilterChange} />
        </Box>
      </Box>

      {/* TABLE */}
      <BasicTable
        columns={columns}
        data={rows}
        loading={isLoading}
        pagination={{
          page: pagination.page ,   // convert 1-index → 0-index for table
          perPage: pagination.perPage,
          totalPages,
          total: totalRecords,
        }}
         rowPadding="py-2" 
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </>
  );
}
