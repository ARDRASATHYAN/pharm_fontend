// src/components/purchase/PurchaseInvoiceMockApiHeader.jsx
import React, { useState, useLayoutEffect, useEffect } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";

import { useExcessStock } from "@/hooks/useExcessStock";
import { getExcessStockColumns } from "./component/ExcessStockHeader";

export default function DamagedStockMockApiHeader() {
  // -----------------------------
  // 🔹 Pagination + Fetching Data
  // -----------------------------
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  // Fetch data with pagination
  const { data: excessitem = {}, isLoading, isFetching } =
    useExcessStock(pagination);

  // Extract proper API fields
  const excessitems = excessitem.excess_item || [];
  console.log(excessitems,'excessitems');
  
  const totalPages = excessitem.totalPages || 1;
  const totalRecords = excessitem.total || 0;

  // -----------------------------
  // 🔹 Dynamic Rows Based on Screen Size
  // -----------------------------
  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 180; // your layout header height
    const rowHeight = 34; // approx row height

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

  // -----------------------------
  // 🔹 Edit Form (Not used yet)
  // -----------------------------
  const [formData, setFormData] = useState({
    purchase_id: "",
    invoice_no: "",
    invoice_date: "",
    supplier_id: "",
    store_id: "",
    user_id: "",
    total_amount: "",
    total_discount: "",
    total_gst: "",
    net_amount: "",
  });

  const handleEdit = (row) => {
    console.log("row", row);
    setFormData({
      purchase_id: row.purchase_id,
      invoice_no: row.invoice_no,
      invoice_date: row.invoice_date,
      supplier_id: row.supplier_id,
      store_id: row.store_id,
      user_id: row.created_by,
      total_amount: row.total_amount,
      total_discount: row.total_discount,
      total_gst: row.total_gst,
      net_amount: row.net_amount,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this damaged item?")) {
      // delete mutation here
    }
  };

  // -----------------------------
  // 🔹 Pagination Handlers
  // -----------------------------
  const handlePageChange = (pageIndex) => {
    setPagination((prev) => ({ ...prev, page: pageIndex }));
  };

  const handlePerPageChange = (perPage) => {
    setPagination({ page: 1, perPage });
  };

  // -----------------------------
  // 🔹 Render Component
  // -----------------------------
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
          excess Stock List
        </h2>
      </div>

      <BasicTable
        columns={getExcessStockColumns(handleEdit, handleDelete)}
        data={excessitems}
        loading={isLoading || isFetching}
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
