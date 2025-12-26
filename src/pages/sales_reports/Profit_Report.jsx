// src/components/sales/ProfitReport.jsx
import React, { useEffect, useLayoutEffect, useState } from "react";
import BasicTable from "@/components/commen/BasicTable";
import { useProfit } from "@/hooks/useProfit";
import { getProfitReportColumns } from "./components/ProfitColumn";

// export default function ProfitReport() {
//   const [filters, setFilters] = useState({
//     page: 1,
//     perPage: 10,
//   });

//   /* -------- Auto rows based on screen height -------- */
//   const adjustRowsByHeight = () => {
//     const screenHeight = window.innerHeight;
//     const headerHeight = 180;
//     const rowHeight = 34;
//     const rows = Math.floor((screenHeight - headerHeight) / rowHeight);

//   setFilters((prev) => ({
//       ...prev,
//       perPage: Math.max(5, rows),
//       page: 1,
//     }));
//   };

//   useLayoutEffect(() => {
//     adjustRowsByHeight();
//   }, []);

//   useEffect(() => {
//     window.addEventListener("resize", adjustRowsByHeight);
//     return () => window.removeEventListener("resize", adjustRowsByHeight);
//   }, []);

//   /* -------- API Call -------- */
//   const { data: profit = {}, isLoading } = useProfit({
//       page: Number(filters.page),
//     perPage: Number(filters.perPage),
//   });

//   const columns = getProfitReportColumns();

//   const handlePageChange = (page) =>
//     setFilters((prev) => ({ ...prev, page: Number(page) || 1 }));

//   return (
//     <>
//       <div className="flex justify-between mb-3">
//         <h2 className="text-xl font-bold text-blue-700">
//           Profit / Margin Report
//         </h2>
//       </div>

//       <BasicTable
//         columns={columns}
//         data={profit?.data || []}  
//         loading={isLoading}
//        pagination={{
//           page: profit?.pagination?.page || 1,
//           perPage: filters.perPage,
//           totalPages: profit?.pagination?.totalPages || 1,
//           total: profit?.pagination?.total || 0,
//         }}
//         rowPadding="py-2"
//         onPageChange={handlePageChange}
//       />
//     </>
//   );
// }



export default function ProfitReport() {
 
    const [filters, setFilters] = useState({
      search: "",
      page: 1,
      perPage: 10,
    });
  
    // Dynamically calculate perPage based on screen height
    const adjustRowsByHeight = () => {
      const screenHeight = window.innerHeight;
      const headerHeight = 180; 
      const rowHeight = 34;
      const rows = Math.floor((screenHeight - headerHeight) / rowHeight);
      setFilters(prev => ({ ...prev, perPage: Math.max(5, rows), page: 1 }));
    };
  
    useLayoutEffect(() => {
      adjustRowsByHeight();
    }, []);
  
    useEffect(() => {
      window.addEventListener("resize", adjustRowsByHeight);
      return () => window.removeEventListener("resize", adjustRowsByHeight);
    }, []);
  
  
 
    const { data: profit = {}, isLoading } = useProfit({
      page: Number(filters.page),
    perPage: Number(filters.perPage),
  });
   
  
   
   
    const handlePageChange = (page) => setFilters(prev => ({ ...prev, page: Number(page) || 1 }));
  
    const columns = getProfitReportColumns();

  
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
         GST Sales Report
        </h2>
       
      </div>

<BasicTable
  columns={columns}
  data={profit?.data || []}
  loading={isLoading}
  pagination={{
    page: profit?.pagination?.page || 1,
    perPage: filters.perPage,
    totalPages: profit?.pagination?.totalPages || 1,
    total: profit?.pagination?.total || 0,
  }}
  rowPadding="py-2" 
  onPageChange={handlePageChange}
/>

   
    </>
  );
}

