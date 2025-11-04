import React, { useState } from "react";

// --- Sale Form Component ---
function SaleForm({ sale, updateSale, saveSale }) {
  const handleFieldChange = (field, value) => {
    updateSale({ ...sale, [field]: value });
  };

  const handleMedicineChange = (index, field, value) => {
    const meds = [...sale.medicines];
    meds[index][field] = value;

    if (field === "qty" || field === "unit_price") {
      const qty = parseFloat(meds[index].qty) || 0;
      const price = parseFloat(meds[index].unit_price) || 0;
      meds[index].total = qty * price;
    }

    updateSale({ ...sale, medicines: meds });
  };

  const addMedicine = () => {
    updateSale({
      ...sale,
      medicines: [
        ...sale.medicines,
        { name: "", batch_no: "", expiry_date: "", qty: 1, unit_price: 0, total: 0 },
      ],
    });
  };

  const removeMedicine = (i) => {
    const meds = sale.medicines.filter((_, idx) => idx !== i);
    updateSale({ ...sale, medicines: meds });
  };

  const total = sale.medicines.reduce((sum, m) => sum + m.total, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    saveSale({
      ...sale,
      total_amount: total,
      sale_datetime: new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      
      <div className="grid grid-cols-5 gap-3 mb-4">
        <input
          type="text"
          placeholder="Customer Name"
          value={sale.customer_name}
          onChange={(e) => handleFieldChange("customer_name", e.target.value)}
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Address"
          value={sale.address || ""}
          onChange={(e) => handleFieldChange("address", e.target.value)}
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Invoice Number"
          value={sale.invoice_no || ""}
          onChange={(e) => handleFieldChange("invoice_no", e.target.value)}
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={sale.date || ""}
          onChange={(e) => handleFieldChange("date", e.target.value)}
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={sale.payment_mode}
          onChange={(e) => handleFieldChange("payment_mode", e.target.value)}
          className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
        >
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Phone Number"
        value={sale.phone || ""}
        onChange={(e) => handleFieldChange("phone", e.target.value)}
        className="border p-2 rounded-md w-full mb-4 focus:ring-2 focus:ring-blue-400"
      />

      {/* --- Medicine Section --- */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-lg text-gray-700">Medicines</h3>
        <button
          type="button"
          onClick={addMedicine}
          className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
        >
          ➕ Add Medicine
        </button>
      </div>

      {sale.medicines.map((m, i) => (
        <div
          key={i}
          className="grid grid-cols-8 gap-2 mb-2 items-center bg-gray-50 p-2 rounded-md"
        >
          <input
            type="text"
            placeholder="Medicine"
            value={m.name}
            onChange={(e) => handleMedicineChange(i, "name", e.target.value)}
            className="border p-2 rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Batch"
            value={m.batch_no}
            onChange={(e) => handleMedicineChange(i, "batch_no", e.target.value)}
            className="border p-2 rounded-md"
          />
          <input
            type="date"
            value={m.expiry_date}
            onChange={(e) => handleMedicineChange(i, "expiry_date", e.target.value)}
            className="border p-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Qty"
            value={m.qty}
            onChange={(e) => handleMedicineChange(i, "qty", e.target.value)}
            className="border p-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Unit Price"
            value={m.unit_price}
            onChange={(e) => handleMedicineChange(i, "unit_price", e.target.value)}
            className="border p-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Total"
            value={m.total}
            readOnly
            className="border p-2 rounded-md bg-gray-100"
          />
          <button
            type="button"
            onClick={() => removeMedicine(i)}
            className="text-red-600 hover:text-red-800 text-xl"
            title="Remove"
          >
            ✖
          </button>
        </div>
      ))}

      {/* --- Totals --- */}
      <div className="grid grid-cols-4 gap-3 mt-4 border-t pt-3">
        <div>
          <label className="text-sm text-gray-500">Total</label>
          <input
            type="number"
            readOnly
            value={total.toFixed(2)}
            className="border p-2 rounded-md w-full bg-gray-100"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Discount</label>
          <input
            type="number"
            placeholder="Discount"
            value={sale.discount || ""}
            onChange={(e) => handleFieldChange("discount", e.target.value)}
            className="border p-2 rounded-md w-full"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Net Total</label>
          <input
            type="number"
            readOnly
            value={(total - (sale.discount || 0)).toFixed(2)}
            className="border p-2 rounded-md w-full bg-gray-100"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Paid Amount</label>
          <input
            type="number"
            placeholder="Paid"
            value={sale.paid || ""}
            onChange={(e) => handleFieldChange("paid", e.target.value)}
            className="border p-2 rounded-md w-full"
          />
        </div>
      </div>

      {/* --- Footer --- */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-gray-600 text-sm">
          🕒 Sale Time: {new Date().toLocaleTimeString()}
        </p>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium shadow-md"
        >
          💾 Save Sale
        </button>
      </div>
    </form>
  );
}

// --- Main Multi-Customer Page ---
export default function MultiCustomerSales() {
  const [salesTabs, setSalesTabs] = useState([
    {
      id: "1",
      customer_name: "",
      doctor_name: "",
      payment_mode: "cash",
      medicines: [
        { name: "", batch_no: "", expiry_date: "", qty: 1, unit_price: 0, total: 0 },
      ],
      isActive: true,
    },
  ]);

  const addNewTab = () => {
    const newTab = {
      id: Date.now().toString(),
      customer_name: "",
      doctor_name: "",
      payment_mode: "cash",
      medicines: [
        { name: "", batch_no: "", expiry_date: "", qty: 1, unit_price: 0, total: 0 },
      ],
      isActive: true,
    };
    setSalesTabs((prev) =>
      prev.map((t) => ({ ...t, isActive: false })).concat(newTab)
    );
  };

  const switchTab = (id) => {
    setSalesTabs((prev) =>
      prev.map((t) => ({ ...t, isActive: t.id === id }))
    );
  };

  const updateSale = (id, updatedSale) => {
    setSalesTabs((prev) => prev.map((t) => (t.id === id ? updatedSale : t)));
  };

  const saveSale = (id, saleData) => {
    console.log("✅ Saved Sale:", saleData);
    setSalesTabs((prev) => prev.filter((t) => t.id !== id));
    alert("✅ Sale Saved Successfully!");
  };

  const activeSale = salesTabs.find((t) => t.isActive);

  return (
    <div className="">
    

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {salesTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              tab.isActive
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border text-gray-700 hover:bg-blue-50"
            }`}
          >
            {tab.customer_name || `Sale #${tab.id}`}
          </button>
        ))}
        <button
          onClick={addNewTab}
          className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 shadow-md"
        >
          ➕ New Sale
        </button>
      </div>

      {/* Active Sale */}
      {activeSale ? (
        <SaleForm
          sale={activeSale}
          updateSale={(data) => updateSale(activeSale.id, data)}
          saveSale={(data) => saveSale(activeSale.id, data)}
        />
      ) : (
        <p className="text-gray-500 text-center">No active sale</p>
      )}
    </div>
  );
}
