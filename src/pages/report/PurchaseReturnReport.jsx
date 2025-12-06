import React, { useState, useEffect, useLayoutEffect } from "react";
import { Box, TextField } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import ReportFilter from "./components/reportFilter";
import { getPurchaseReturnReportColumns } from "./components/PurchaseReturnReportHeader";
import { usePurchaseReturnReport } from "@/hooks/useReport";

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
  // Pagination
  // ----------------------------
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  // ----------------------------
  // Auto rows by screen height
  // ----------------------------
  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 180;
    const rowHeight = 34;

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
  const { data: report, isLoading } = usePurchaseReturnReport({
    ...filters,
    page: pagination.page,
    perPage: pagination.perPage,
  });

  const rows = Array.isArray(report?.data) ? report.data : [];

  const totalPages = report?.pagination?.totalPages || 1;
  const totalRecords = report?.pagination?.total || 0;

  // ----------------------------
  // Filter handlers
  // ----------------------------
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // ----------------------------
  // Pagination handlers
  // ----------------------------
  const handlePageChange = (pageIndex) => {
    setPagination((prev) => ({ ...prev, page: pageIndex }));
  };

  const handlePerPageChange = (perPage) => {
    setPagination({ page: 1, perPage });
  };

  const columns = getPurchaseReturnReportColumns();

  return (
    <>
      <h2 className="text-xl font-bold text-blue-700 tracking-wide p-0">
        Purchase Return Report
      </h2>

      {/* TOP BAR */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <TextField
          size="small"
          placeholder="Search item / supplier / invoice"
          value={filters.search}
          onChange={handleSearchChange}
        />

        <Box display="flex" gap={2} alignItems="center">
          <ReportFilter filters={filters} onFilterChange={handleFilterChange} />
        </Box>
      </Box>

      {/* TABLE */}
      <BasicTable
        columns={columns}
        data={report}
        loading={isLoading}
        pagination={{
          page: pagination.page,
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
