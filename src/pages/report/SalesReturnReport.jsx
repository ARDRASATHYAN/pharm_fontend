import React, { useState, useEffect, useLayoutEffect } from "react";
import BasicTable from "@/components/commen/BasicTable";
import { useSalesReturnReport } from "@/hooks/useReport";
import ReportFilter from "./components/reportFilter";
import { Box } from "@mui/material";
import { getSalesReturnReportColumns } from "./components/SalesReportReturnHeader";

export default function SalesReturnReport() {
  const [filters, setFilters] = useState({ from_date: "", to_date: "", search: "" });
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 180;
    const rowHeight = 34;
    const rows = Math.floor((screenHeight - headerHeight) / rowHeight);
    setPagination((prev) => ({ ...prev, perPage: Math.max(5, rows), page: 1 }));
  };

  useLayoutEffect(() => {
    adjustRowsByHeight();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", adjustRowsByHeight);
    return () => window.removeEventListener("resize", adjustRowsByHeight);
  }, []);

  const { data: salesreturnreport = [], isLoading } = useSalesReturnReport({
    ...filters,
    page: pagination.page,
    perPage: pagination.perPage,
  });

  const rows = Array.isArray(salesreturnreport?.data) ? salesreturnreport.data : [];
  const totalPages = salesreturnreport?.pagination?.totalPages || 1;
  const totalRecords = salesreturnreport?.pagination?.total || 0;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (pageIndex) => setPagination((prev) => ({ ...prev, page: pageIndex }));
  const handlePerPageChange = (perPage) => setPagination({ page: 1, perPage });

  const columns = getSalesReturnReportColumns();

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-700 tracking-wide mb-4">Sales Return Report</h2>
      <Box display="flex" gap={2} alignItems="center" className="justify-end" mb={2}>
        <ReportFilter filters={filters} onFilterChange={handleFilterChange} />
      </Box>

      <BasicTable
        columns={columns}
        data={rows}
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
    </div>
  );
}
