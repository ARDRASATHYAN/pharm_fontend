// src/components/purchase/PurchaseInvoiceMockApiHeader.jsx
import React, { useState, useEffect, useLayoutEffect } from "react";
import BasicTable from "@/components/commen/BasicTable";
import { getSalesReturnColumns } from "./components/SalesReturnHeader";
import { usesalesreturnitems, useSalesReturnList } from "@/hooks/useSalesReturn";
import { Box, Button } from "@mui/material";

export default function SalesReturnMockApiHeader() {
  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    search: "",
  });


  const [openItems, setOpenItems] = useState(false);

  const [selectedReturnId, setSelectedReturnId] = useState(null);


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


  const {
    data: salesItems,
    isLoading: itemloading,
    error,
  } = usesalesreturnitems(selectedReturnId);


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


  const handleItem = (id) => {
    setSelectedReturnId(id)
    setOpenItems(true);

  }

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
        columns={getSalesReturnColumns(handleEdit, handleDelete, handleItem)}
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


      {openItems && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300,
            overflowY: "auto",
            p: 2,
          }}
        >
          <Box
            sx={{
              background: "#fff",
              p: 4,
              width: "100%",
              maxWidth: 1200,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            {/* Header */}
            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }} className="font-bold">
                {/* Invoice No: {salesItems?.data?.[0]?.purchaseInvoice?.invoice_no} */}
              </h3>
              <Button variant="outlined" color="secondary" onClick={() => setOpenItems(false)}>
                Close
              </Button>
            </Box>

            {itemloading && <p>Loading items...</p>}

            {!itemloading && salesItems?.data?.length === 0 && <p>No items found</p>}

            {!itemloading && salesItems?.data?.length > 0 && (
              <>
                {/* Table */}
                <Box sx={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      textAlign: "center",
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#1976d2", color: "#fff", position: "sticky", top: 0 }}>
                        <th style={{ padding: "8px" }}>Item</th>
                        <th style={{ padding: "8px" }}>HSN</th>
                        <th style={{ padding: "8px" }}>Batch</th>
                        <th style={{ padding: "8px" }}>R-QTY</th>
                        <th style={{ padding: "8px" }}>rate</th>
                        <th style={{ padding: "8px" }}>gst percent</th>
                        <th style={{ padding: "8px" }}>gst amount</th>
                        <th style={{ padding: "8px" }}>Taxable Amount</th>
                        <th style={{ padding: "8px" }}>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesItems.data.map((row, index) => (
                        <tr
                          key={row.purchase_item_id || index}
                          style={{
                            background: index % 2 === 0 ? "#f5f5f5" : "#fff",
                          }}
                        >
                          <td style={{ padding: "6px" }}>{row.item?.name}</td>
                          <td style={{ padding: "6px" }}>{row.item?.hsn?.hsn_code}</td>
                          <td style={{ padding: "6px" }}>{row.batch_no}</td>
                          <td style={{ padding: "6px" }}>{row.qty}</td>
                          <td style={{ padding: "6px" }}>{row.rate}</td>

                          {/* <td style={{ padding: "6px" }}>{row.sale_rate}</td> */}
                          <td style={{ padding: "6px" }}>{row.gst_percent}%</td>
                          <td style={{ padding: "6px" }}>{row.gst_amount}</td>
                          <td style={{ padding: "6px" }}>{row.taxable_amount}</td>
                          <td style={{ padding: "6px" }}>{row.total_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>

                {/* Totals */}
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "flex-end",
                    flexDirection: "column",
                    gap: 1,
                    background: "#f0f0f0",
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  <p><strong>Total Taxable:</strong> {salesItems.data[0]?.saleReturn
                    ?.
                    total_taxable
                  }</p>
                  <p><strong>Total GST:</strong> {salesItems.data[0]?.saleReturn
                    ?.
                    total_gst}</p>
                  <p><strong>Total Amount :</strong> {salesItems.data[0]?.saleReturn
                    ?.
                    total_amount}</p>

                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
