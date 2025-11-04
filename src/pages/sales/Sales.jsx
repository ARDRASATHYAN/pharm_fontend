import React, { useState } from "react";
import DataTable from "../../components/commen/Datatable";
import { getSalesColumns } from "./components/SalesHeader";
import { mockSalesData } from "./data/mockSalesData";

export default function Sales() {
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

   const handleClose = () => {
    setOpen(false);
  };

  const handleMedicineSubmit = (data) => {
    console.log("📦 Final Submitted:", data);
    // send to backend using axios.post("/api/medicine", data)
  };

  const data = mockSalesData.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );
  const columns = getSalesColumns();

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
          placeholder="Search medicine..."
        />
        <a href="/sale"><button className="bg-blue-700 text-white px-3 py-2 rounded" onClick={handleClickOpen} >
          Add Medicine
        </button></a>
      </div>
      <DataTable columns={columns} data={data} />

        
    </div>
  );
}
