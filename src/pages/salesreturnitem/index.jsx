import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { usesalesreturnitems } from "@/hooks/useSalesReturn";
import { getSalesReturnItemColumns } from "./components/SalesReturnItemsHeader";

export default function SalesReturnItemMockApiHeader() {
  const { data: salereturnitem = [], isLoading,isFetching } = usesalesreturnitems();


  


 



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
  const columns = getSalesReturnItemColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
         sales return Item List
        </h2>
      </div>


      <BasicTable columns={columns} data={salereturnitem} loading={isLoading || isFetching}/>


      
    </>
  );
}
