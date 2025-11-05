import React, { useState } from "react";
import DataTable from "../../components/commen/Datatable";
import { mockMedicines } from "./data/MedicineData";
import { getMedicineColumns } from "./components/MedicineHeaders";
import MedicineForm from "./components/MedicineForm";

export default function Medicines() {
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

  const data = mockMedicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );
  const columns = getMedicineColumns();

  return (
    <div>
      <h2 className="text-xl font-bold text-blue-700 tracking-wide mb-2">
        Stock list
      </h2>
      <div className="flex gap-2 mb-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
          placeholder="Search medicine..."
        />
        <button className="bg-blue-700 text-white px-3 py-2 rounded" onClick={handleClickOpen}>
          Add Medicine
        </button>
      </div>
      <DataTable columns={columns} data={data} />

      <MedicineForm
        open={open}
        handleClose={handleClose}
        onSubmit={handleMedicineSubmit}
      />
    </div>
  );
}
