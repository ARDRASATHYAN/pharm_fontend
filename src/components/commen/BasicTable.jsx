import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Skeleton } from "@mui/material";

const BasicTable = ({ columns, data, onRowClick, striped = true,loading = false }) => {
  // ✅ Control pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination, // tell react-table how to update
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // ✅ Adjust number of rows based on screen height dynamically
  const adjustRowsByHeight = () => {
    const screenHeight = window.innerHeight;
    const headerHeight = 140; // adjust for your topbar/sidebar
    const rowHeight = 34; // average row height
    const availableHeight = screenHeight - headerHeight;
    const rows = Math.floor(availableHeight / rowHeight);
    const pageSize = Math.max(5, Math.min(rows, 100));
    setPagination((prev) => ({ ...prev, pageSize }));
  };

  // ✅ Run before first paint
  useLayoutEffect(() => {
    adjustRowsByHeight();
  }, []);

  // ✅ Recalculate on resize
  useEffect(() => {
    window.addEventListener("resize", adjustRowsByHeight);
    return () => window.removeEventListener("resize", adjustRowsByHeight);
  }, []);



  const skeletonRows = Array.from({ length: pagination.pageSize });

  return (
    <>
      <table className="w-full border-collapse border">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-2 border-b bg-gray-100 text-left  text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>

           {loading
            ? //  MUI Skeleton rows
              skeletonRows.map((_, i) => (
                <tr key={i}>
                  {columns.map((col, j) => (
                    <td key={j} className="py-2 px-2 border-b">
                      <div className="h-3 bg-gray-200 rounded w-[80%]"></div>
                    </td>
                  ))}
                </tr>
              ))
            : //  Normal data rows
          table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className=" even:bg-gray-100 hover:bg-gray-200 cursor-pointer"
              onClick={() => onRowClick?.(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-1 px-2 text-xs text-gray-800 ">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        
      </table>

      {/* ✅ Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-2 bg-gray-50 border-b border-l border-r border-gray-200 gap-2 sm:gap-0">
        <div className="text-sm text-gray-600">
          Page {pagination.pageIndex + 1} of {table.getPageCount()}
        </div>

        {/* ✅ Page number buttons */}
        <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-end">
          <button
            className="px-2 py-1 border rounded text-sm disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="px-2 py-1 border rounded text-sm disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>

          {Array.from({ length: table.getPageCount() }).map((_, i) => (
            <button
              key={i}
              className={`px-2 py-1 border rounded text-sm ${i === pagination.pageIndex
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-100"
                }`}
              onClick={() => table.setPageIndex(i)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-2 py-1 border rounded text-sm disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
          <button
            className="px-2 py-1 border rounded text-sm disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>
      </div>
    </>
  );
};

export default BasicTable;