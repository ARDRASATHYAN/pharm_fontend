import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import BasicTable from "@/components/commen/BasicTable";
import { useSaleItems, useSalesItemsList } from "@/hooks/useSalesInvoice";
import { getSalesItemColumns } from "./component/SalesItemHeader";

export default function SalesItemMockApiHeader() {
  const { data: salesitem = [], isLoading,isFetching } = useSalesItemsList();
  console.log("salesitem",salesitem);
  


  


 



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
  const columns = getSalesItemColumns(handleEdit, handleDelete);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2 className="text-xl font-bold text-blue-700 tracking-wide">
         Sales Item List
        </h2>
      </div>


      <BasicTable columns={columns} data={salesitem} loading={isLoading || isFetching}/>


      
    </>
  );
}
