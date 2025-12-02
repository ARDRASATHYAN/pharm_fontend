import React from "react";
import { useReactTable, flexRender, getCoreRowModel } from "@tanstack/react-table";
import { Skeleton } from "@mui/material";

const BasicTable = ({ columns, data = [], loading = false, pagination, onPageChange }) => {
  const { page = 1, perPage = 10, totalPages = 1, total = 0 } = pagination;

  const table = useReactTable({
    data,
    columns,
    state: { pagination: { pageIndex: page - 1, pageSize: perPage } },
    manualPagination: true,
    pageCount: totalPages,
    onPaginationChange: (newPagination) => onPageChange?.(newPagination.pageIndex + 1),
    getCoreRowModel: getCoreRowModel(),
  });

  const skeletonRows = Array.from({ length: perPage });

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

      {/* Pagination Footer */}
      <div className="flex justify-between items-center p-2 bg-gray-50 border border-t-0 border-gray-200 flex-wrap gap-2">
        <div className="text-sm text-gray-600">
          Page {page} of {totalPages} | Total {total} users
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <button onClick={() => onPageChange(1)} disabled={page === 1} className="px-2 py-1 border rounded text-sm disabled:opacity-50">{'<<'}</button>
          <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="px-2 py-1 border rounded text-sm disabled:opacity-50">Prev</button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`px-2 py-1 border rounded text-sm ${i + 1 === page ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="px-2 py-1 border rounded text-sm disabled:opacity-50">Next</button>
          <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} className="px-2 py-1 border rounded text-sm disabled:opacity-50">{'>>'}</button>
        </div>
      </div>
    </>
  );
};

export default BasicTable;
