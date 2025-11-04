import React, { useState } from "react";

export default function SalesAdd() {
  const [saleNo, setSaleNo] = useState(`SALE-${Date.now()}`);
  const [customer, setCustomer] = useState({ name: "", phone: "" });

  const [medicines, setMedicines] = useState([
    { name: "", qty: 1, price: 0, total: 0 },
  ]);

  const [taxPercent, setTaxPercent] = useState(5);
  const [discount, setDiscount] = useState(0);

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;

    if (field === "qty" || field === "price") {
      updated[index].total =
        (parseFloat(updated[index].qty) || 0) *
        (parseFloat(updated[index].price) || 0);
    }

    setMedicines(updated);
  };

  const addMedicineRow = () => {
    setMedicines([...medicines, { name: "", qty: 1, price: 0, total: 0 }]);
  };

  const removeMedicineRow = (index) => {
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
  };

  const subtotal = medicines.reduce((sum, m) => sum + m.total, 0);
  const tax = (subtotal * taxPercent) / 100;
  const discountAmt = (subtotal * discount) / 100;
  const grandTotal = subtotal + tax - discountAmt;

  const handleSaveSale = () => {
    if (!customer.name || medicines.length === 0) {
      alert("Please fill customer and medicine details!");
      return;
    }

    const saleData = {
      saleNo,
      date: new Date().toLocaleString(),
      customer,
      medicines,
      subtotal,
      tax,
      discountAmt,
      grandTotal,
    };

    console.log("✅ Sale Added:", saleData);
    alert("Sale added successfully!");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        💊 Add New Sale
      </h1>

      {/* Sale Header */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">Sale Info</h2>
          <p>Sale No: <b>{saleNo}</b></p>
          <p>Date: <b>{new Date().toLocaleDateString()}</b></p>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">Customer Details</h2>
          <input
            type="text"
            placeholder="Customer Name"
            value={customer.name}
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
            className="border p-2 w-full mb-2 rounded"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Medicine Table */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h2 className="font-semibold text-gray-700 mb-4">
          🧾 Medicine Details
        </h2>

        <table className="w-full border mb-4">
          <thead className="bg-green-100">
            <tr>
              <th className="border p-2 text-left">#</th>
              <th className="border p-2 text-left">Medicine</th>
              <th className="border p-2 text-center">Qty</th>
              <th className="border p-2 text-center">Price</th>
              <th className="border p-2 text-center">Total</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m, index) => (
              <tr key={index}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2">
                  <input
                    type="text"
                    placeholder="Medicine name"
                    value={m.name}
                    onChange={(e) =>
                      handleMedicineChange(index, "name", e.target.value)
                    }
                    className="border p-1 w-full rounded"
                  />
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    min="1"
                    value={m.qty}
                    onChange={(e) =>
                      handleMedicineChange(index, "qty", e.target.value)
                    }
                    className="border p-1 w-20 text-center rounded"
                  />
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    min="0"
                    value={m.price}
                    onChange={(e) =>
                      handleMedicineChange(index, "price", e.target.value)
                    }
                    className="border p-1 w-24 text-center rounded"
                  />
                </td>
                <td className="border p-2 text-center">₹{m.total.toFixed(2)}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => removeMedicineRow(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addMedicineRow}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Medicine
        </button>
      </div>

      {/* Totals Section */}
      <div className="bg-white p-4 rounded shadow-sm mt-6 max-w-md ml-auto">
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between mb-2 items-center">
          <span>Tax (%):</span>
          <input
            type="number"
            min="0"
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value)}
            className="border p-1 w-16 text-right rounded"
          />
        </div>

        <div className="flex justify-between mb-2 items-center">
          <span>Discount (%):</span>
          <input
            type="number"
            min="0"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border p-1 w-16 text-right rounded"
          />
        </div>

        <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2">
          <span>Grand Total:</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSaveSale}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Save Sale
          </button>
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Print Bill
          </button>
        </div>
      </div>
    </div>
  );
}
