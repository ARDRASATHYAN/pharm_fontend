import React, { useState } from "react";
import { Box } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { usePurchaseReport } from "@/hooks/useReport";
import { getPurchaseReportColumns } from "./components/purchaseReportHeader";
import ReportFilter from "./components/reportFilter";

export default function PurchaseReport() {
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    page: 1,
    perPage: 20,
  });

  const { data: reportResponse = {}, isLoading } = usePurchaseReport(filters);

  // Flattened data for the table
  const reportData = Array.isArray(reportResponse.data) ? reportResponse.data : [];
  const totalPages = reportResponse.pages || 1;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 })); // reset page
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePerPageChange = (perPage) => {
    setFilters((prev) => ({ ...prev, perPage, page: 1 }));
  };

  const columns = getPurchaseReportColumns();

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-700 tracking-wide mb-4">
        Purchase Report
      </h2>

      <Box display="flex" gap={2} alignItems="center" className="justify-end" mb={2}>
        <ReportFilter filters={filters} onFilterChange={handleFilterChange} />
      </Box>

      <BasicTable
        columns={columns}
        data={reportData}
        loading={isLoading}
        pagination={{
          page: reportResponse.page || 1,
          perPage: filters.perPage,
          totalPages,
          total: reportResponse.total || 0,
        }}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </div>
  );
}
