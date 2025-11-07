"use client";
import apiClient from "@/services/apiClient";
import { BarChart2, ClipboardList, Package, ShoppingCart, Truck, Users, AlertTriangle, DollarSign, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export default function PharmacyDashboard() {
  const stats = [
    { title: "Today’s Sales", value: "₹12,450", icon: <ShoppingCart className="w-6 h-6 text-blue-600" />, color: "border-blue-300" },
    { title: "Total Medicines", value: "240", icon: <Package className="w-6 h-6 text-green-600" />, color: "border-green-300" },
    { title: "Total Customers", value: "120", icon: <Users className="w-6 h-6 text-purple-600" />, color: "border-purple-300" },
    { title: "Total Suppliers", value: "25", icon: <Truck className="w-6 h-6 text-yellow-600" />, color: "border-yellow-300" },
    { title: "Low Stock Items", value: "18", icon: <AlertTriangle className="w-6 h-6 text-orange-600" />, color: "border-orange-300" },
    { title: "Revenue Summary", value: "₹4,80,000", icon: <DollarSign className="w-6 h-6 text-indigo-600" />, color: "border-indigo-300" },
  ];

  const lowStock = [
    { name: "Paracetamol", qty: 4 },
    { name: "Dolo 650", qty: 3 },
    { name: "Azithromycin", qty: 2 },
  ];

  const expirySoon = [
    { name: "Amoxicillin", date: "05 Nov 2025" },
    { name: "Cetrizine", date: "20 Nov 2025" },
  ];
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const res = await apiClient.get("/auth/me");
        setMessage(res.data.message);
        setUser(res.data.user);
      } catch (err) {
        console.error("❌ Failed to fetch protected route", err);
      }
    };
    fetchProtected();
  }, []);


  return (
    <div className="">
      {user && (
        <pre style={{ background: "#eee", padding: "1rem" }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      )}
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 ></h1>
        <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Generate Report
        </button>
      </div>

      {/* Main Section: Stats + Today Report */}
      <div className="flex gap-6">
        {/* Left Side: Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 flex-grow">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white border ${stat.color} rounded-xl p-4 flex items-center justify-between hover:scale-[1.01] transition`}
            >
              <div>
                <h2 className="text-gray-500 text-sm">{stat.title}</h2>
                <p className="text-lg font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className="p-2 rounded-full bg-gray-50">{stat.icon}</div>
            </div>
          ))}
        </div>

        {/* Right Side: Today's Report */}
        <div className="bg-white border border-red-300 rounded-xl p-5 w-[280px] flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-red-600 mb-3">Today’s Report</h2>
            <div className="text-sm text-gray-700 space-y-2">
              <p>💰 Total Sales: ₹12,450</p>
              <p>📦 Purchases: ₹8,200</p>
              <p>👥 New Customers: 5</p>
              <p>🧾 Invoices Generated: 18</p>
            </div>
          </div>
          <button className="mt-4 text-sm bg-red-600 text-white py-2 rounded-md hover:bg-red-700">
            View Details
          </button>
        </div>
      </div>

      {/* Low Stock & Expiry Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Low Stock */}
        <div className="bg-white border border-sky-300 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-md font-semibold text-gray-800">Low Stock Items</h3>
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            {lowStock.map((item, i) => (
              <li key={i} className="flex justify-between border-b border-gray-100 py-1">
                <span>{item.name}</span>
                <span className="text-red-500 font-medium">Qty: {item.qty}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expiry Soon */}
        <div className="bg-white border border-yellow-300 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-yellow-500" />
            <h3 className="text-md font-semibold text-gray-800">Expiring Soon</h3>
          </div>
          <ul className="text-sm text-gray-700 space-y-1">
            {expirySoon.map((item, i) => (
              <li key={i} className="flex justify-between border-b border-gray-100 py-1">
                <span>{item.name}</span>
                <span className="text-red-500 font-medium">{item.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
