import React, { useState, useLayoutEffect, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import ConfirmDialog from "@/components/commen/ConfirmDialog";
import { showSuccessToast, showErrorToast } from "@/lib/toastService";

import { usestock } from "@/hooks/useStock";
import { getStockColumns } from "./components/StockHeader";

export default function StockMockApiHeader() {
  // ----------------------------
  // Modal / Edit state
  // ----------------------------
  const [openForm, setOpenForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  // ----------------------------
  // Delete state
  // ----------------------------
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  // ----------------------------
  // Filters / Pagination / Search
  // ----------------------------
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    perPage: 10,
  });

  // Dynamically calculate perPage based on screen height
  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 180; // filters + table header
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

  // Fetch purchase invoices
  const { data: stockData = {}, isLoading } = usestock({
    search: filters.search,
    page: Number(filters.page),
    perPage: Number(filters.perPage),
  });

  console.log("data",stockData);


  


  // ----------------------------
  // Filters & search
  // ----------------------------
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };
  const handlePageChange = (page) => setFilters(prev => ({ ...prev, page: Number(page) || 1 }));

  const columns = getStockColumns();

  return (
    <>
      <h2 className="text-xl font-bold text-blue-700 tracking-wide mb-2">stock</h2>

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
        data={stockData?.data}
        loading={isLoading}
       pagination={{
    page: stockData?.pagination?.page || 1,
    perPage: stockData?.pagination?.limit || filters.perPage,
    totalPages: stockData?.pagination?.totalPages || 1,
    total: stockData?.pagination?.total || 0,
  }}
        rowPadding="py-2" 
        onPageChange={handlePageChange}
      />

    

     
    </>
  );
}
