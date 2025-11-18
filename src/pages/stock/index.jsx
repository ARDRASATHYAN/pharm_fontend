import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { usestock } from "@/hooks/useStock";
import { getStockColumns } from "./components/StockHeader";

export default function StockMockApiHeader() {
  const { data: stock = [], isLoading,isFetching } = usestock();


 



 



  // ✏️ Edit Handler

  const handleEdit = (row) => {
    console.log("row", row);
  };

  // ❌ Delete Handler
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
    }
  };


 


  // ✅ pass handlers to columns (so edit/delete buttons work)
  const columns = getStockColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
          stock Item List
        </h2>
       
      </div>


      <BasicTable columns={columns} data={stock} loading={isLoading || isFetching}/>


    </>
  );
}
