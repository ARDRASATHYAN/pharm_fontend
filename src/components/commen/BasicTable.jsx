import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";

const BasicTable = ({ columns, data, loading = false, pagination: paginationProp, onPageChange }) => {
  const [pageSize, setPageSize] = useState(10);

  // Dynamically calculate rows based on screen height
  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 200; // table + other headers height
    const rowHeight = 34; // row height
    const availableHeight = screenHeight - headerHeight;
    const rows = Math.floor(availableHeight / rowHeight);
    setPageSize(Math.max(5, rows)); // minimum 5 rows
  };

  useLayoutEffect(() => {
    adjustRowsByHeight();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", adjustRowsByHeight);
    return () => window.removeEventListener("resize", adjustRowsByHeight);
  }, []);

  const table = useReactTable({
    data,
    columns,
    pageCount: paginationProp?.totalPages || 1,
    state: {
      pagination: {
        pageIndex: (paginationProp?.page || 1) - 1,
        pageSize: pageSize,
      },
    },
    manualPagination: true,
    onPaginationChange: (newPagination) => {
      onPageChange?.(newPagination.pageIndex + 1);
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const skeletonRows = Array.from({ length: pageSize });

  return (
    <>
      <table className="w-full border-collapse border">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="p-2 border-b bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {loading
            ? skeletonRows.map((_, i) => (
                <tr key={i}>
                  {columns.map((col, j) => (
                    <td key={j} className="py-2 px-2 border-b">
                      <div className="h-3 bg-gray-200 rounded w-[80%]"></div>
                    </td>
                  ))}
                </tr>
              ))
            : table.getRowModel().rows.map(row => (
                <tr key={row.id} className="even:bg-gray-100 hover:bg-gray-200 cursor-pointer">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-1 px-2 text-xs text-gray-800">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </>
  );
};

export default BasicTable;
