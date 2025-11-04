import React, { useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function DataTable({ columns, data, onRowClick, striped = true }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10, // default
      },
    },
  });

  // Adjust number of rows based on screen height
  useEffect(() => {
    const adjustRowsByHeight = () => {
      const screenHeight = window.innerHeight;
      const headerHeight = 180; // adjust if you have navbar/header/footer
      const rowHeight = 48; // average table row height in px

      // Calculate how many rows fit on the screen
      const availableHeight = screenHeight - headerHeight;
      const rows = Math.floor(availableHeight / rowHeight);

      // Set minimum and maximum limits for safety
      const pageSize = Math.max(5, Math.min(rows, 50));

      table.setPageSize(pageSize);
    };

    // Run on mount + window resize
    adjustRowsByHeight();
    window.addEventListener("resize", adjustRowsByHeight);
    return () => window.removeEventListener("resize", adjustRowsByHeight);
  }, [table]);

  return (
    <div className="border border-gray-300 rounded-md flex flex-col max-h-[80vh]">
      {/* Table Header + Body */}
      <div className="overflow-y-auto flex-1">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  striped && index % 2 === 1 ? "bg-gray-50" : "bg-white"
                }`}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 text-xs text-gray-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-1 bg-gray-50 border-t border-gray-200 gap-2 sm:gap-0">
        <div className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex flex-wrap sm:flex-row items-center gap-2">
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </button>
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
          <button
            className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
}
