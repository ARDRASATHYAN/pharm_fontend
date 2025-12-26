// src/components/sales/MrpVsSalesPriceReport.jsx
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import BasicTable from "@/components/commen/BasicTable";
import { getMrpVsSalepriceColumns } from "./components/mrpVsSalesPriceColumn";
import { usestock } from "@/hooks/useStock";

export default function MrpVsSalesPriceReport() {
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
    perPage: 10,
  });

  /* ---------------- Auto rows based on screen height ---------------- */
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

  /* ---------------- API Call ---------------- */
  const { data: stockData = {}, isLoading } = usestock({
    search: filters.search,
    page: Number(filters.page),
    perPage: Number(filters.perPage),
  });

  /* ---------------- Transform Data ---------------- */
  const tableData = useMemo(() => {
    return (stockData?.data || []).map((row) => {
      const packSize = Number(row.item?.pack_size || 1);

      return {
        item_name: row.item?.name,
        batch_no: row.batch_no ?? "-",
        pack_size: packSize,

        // Pack prices
        mrp_pack: Number(row.mrp),
        sale_pack: Number(row.sale_rate),
        purchase_pack: Number(row.purchase_rate),
sales_deiscount:row.discount_percent,
        // Unit prices
        mrp_unit: (Number(row.mrp) / packSize).toFixed(2),
        sale_unit: Number(row.sale_price),
        purchase_unit: Number(row.cost_price),
      };
    });
  }, [stockData]);

  const columns = getMrpVsSalepriceColumns();

  const handlePageChange = (page) =>
    setFilters((prev) => ({ ...prev, page: Number(page) || 1 }));

  /* ---------------- UI ---------------- */
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
          MRP V/S Sales Price Report
        </h2>
      </div>

      <BasicTable
        columns={columns}
        data={tableData}
        loading={isLoading}
        pagination={{
          page: stockData?.pagination?.page || 1,
          perPage: filters.perPage,
          totalPages: stockData?.pagination?.totalPages || 1,
          total: stockData?.pagination?.total || 0,
        }}
        rowPadding="py-2"
        onPageChange={handlePageChange}
      />
    </>
  );
}
