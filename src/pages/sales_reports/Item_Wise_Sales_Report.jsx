// src/components/sales/ItemWiseSalesReport.jsx
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import BasicTable from "@/components/commen/BasicTable";
import { useSalesInvoiceList } from "@/hooks/useSalesInvoice";
import { getItemWiseSalesColumns } from "./components/ItemWiseSalesColumn";

export default function ItemWiseSalesReport() {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    perPage: 10,
  });

  /* -------------------- Auto rows based on screen height -------------------- */
  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 180;
    const rowHeight = 34;
    const rows = Math.floor((screenHeight - headerHeight) / rowHeight);

    setFilters((prev) => ({
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

  /* -------------------- API Call -------------------- */
  const { data: salesinvoice = {}, isLoading } = useSalesInvoiceList({
    search: filters.search,
    page: filters.page,
    perPage: filters.perPage,
  });

  /* -------------------- ITEM-WISE AGGREGATION -------------------- */
  const itemWiseResult = useMemo(() => {
    const report = {};

    (salesinvoice?.data || []).forEach((sale) => {
      sale.items.forEach((item) => {
        // group by item + gst
        const key = `${item.item_id}_${item.gst_percent}`;

        const gross = Number(item.total_amount);
        const gstRate = Number(item.gst_percent);
        const taxable = gross / (1 + gstRate / 100);
        const gst = gross - taxable;

        if (!report[key]) {
          report[key] = {
            item_id: item.item_id,
            gst_percent: gstRate,
            qty: 0,
            taxable: 0,
            gst: 0,
            gross: 0,
          };
        }

        report[key].qty += Number(item.qty);
        report[key].taxable += taxable;
        report[key].gst += gst;
        report[key].gross += gross;
      });
    });

    return Object.values(report);
  }, [salesinvoice]);

  const columns = getItemWiseSalesColumns();

  const handlePageChange = (page) =>
    setFilters((prev) => ({ ...prev, page: Number(page) || 1 }));

  /* -------------------- UI -------------------- */
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
          Item-wise GST Sales Report
        </h2>
      </div>

      <BasicTable
        columns={columns}
        data={itemWiseResult}
        loading={isLoading}
        pagination={{
          page: filters.page,
          perPage: filters.perPage,
          totalPages: 1, // item-wise = client aggregation
          total: itemWiseResult.length,
        }}
        rowPadding="py-2"
        onPageChange={handlePageChange}
      />
    </>
  );
}
