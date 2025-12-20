// src/components/purchase/PurchaseInvoiceMockApiHeader.jsx
import React, { useState, useEffect, useLayoutEffect } from "react";
import BasicTable from "@/components/commen/BasicTable";
import { getSalesReturnColumns } from "./components/SalesReturnHeader";
import { useSalesReturnList } from "@/hooks/useSalesReturn";

export default function SalesReturnMockApiHeader() {
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    search: "",
  });

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

    setPagination((prev) => ({
      ...prev,
      perPage: Math.max(5, rows),
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
  // Fetch data
  // ----------------------------
  const { data: salesreturnlist = {}, isLoading } = useSalesReturnList({
    ...filters,
    page: pagination.page,
    perPage: pagination.perPage,
  });

  const rows = Array.isArray(salesreturnlist?.data)
    ? salesreturnlist.data
    : [];

  const totalPages = salesreturnlist?.pagination?.totalPages || 1;
  const totalRecords = salesreturnlist?.pagination?.total || 0;

  // ----------------------------
  // Optional handlers
  // ----------------------------
  const handleEdit = (row) => {
    console.log("Edit", row);
  };

  const handleDelete = (row) => {
    console.log("Delete", row);
  };

  // ----------------------------
  // Render
  // ----------------------------
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
          Sales Return List
        </h2>
      </div>

      <BasicTable
        columns={getSalesReturnColumns(handleEdit, handleDelete)}
        data={rows}
        loading={isLoading}
        pagination={{
          page: pagination.page,
          perPage: pagination.perPage,
          totalPages,
          total: totalRecords,
        }}
        rowPadding="py-2"
        onPageChange={(page) =>
          setPagination((prev) => ({ ...prev, page }))
        }
        onPerPageChange={(perPage) =>
          setPagination({ page: 1, perPage })
        }
      />
    </>
  );
}
