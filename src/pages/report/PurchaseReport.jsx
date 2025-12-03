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
  // Pagination (1-indexed for backend)
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
    const headerHeight = 180; // title + search + filters
    const rowHeight = 34;
    const rows = Math.floor((screenHeight - headerHeight) / rowHeight);
    const safeRows = Math.max(5, rows);
    setPagination((prev) => ({ ...prev, perPage: safeRows, page: 1 }));
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
    page: pagination.page, // backend page (1-indexed)
    perPage: pagination.perPage,
  });

  const rows = Array.isArray(report?.data) ? report.data : [];
  const totalPages = report?.totalPages || 1;

  // ----------------------------
  // Filters and search
  // ----------------------------
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // reset page
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // reset page
  };

  // ----------------------------
  // Pagination handlers
  // ----------------------------
  const handlePageChange = (pageIndex) => {
    // table sends 0-indexed page → backend needs 1-indexed
    setPagination((prev) => ({ ...prev, page: pageIndex }));
  };

  const handlePerPageChange = (perPage) => {
    setPagination({ page: 1, perPage }); // reset to first page
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
          page: pagination.page-1, // 0-indexed for table
          perPage: pagination.perPage,
          totalPages,
          total: report?.total || 0,
        }}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </>
  );
}
