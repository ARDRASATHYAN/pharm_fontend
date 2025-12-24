"use client";
import { usePurchaseTodayNetAmount, usePurchaseTotalNetAmount } from "@/hooks/usePurchaseInvoice";
import { useTodayNetAmount, useTotalCustomers, useTotalNetAmount } from "@/hooks/useSalesInvoice";
import { useExpiringStock, useLowStock, useTotalMedicine } from "@/hooks/useStock";
import { useTotalSupplier } from "@/hooks/useSupplier";
import apiClient from "@/services/apiClient";
import { BarChart2, ClipboardList, Package, ShoppingCart, Truck, Users, AlertTriangle, DollarSign, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export default function PharmacyDashboard() {
 


  const { data, isLoading } = useLowStock({
    limit: 10,
    store_id: 1,
  });


   const { data:expiringstock, isLoading:expiringloading } = useExpiringStock({
    limit: 10,
    store_id: 1,
  });

  const { data:totalmedicine}=useTotalMedicine({store_id: 1,})

  const { data:totalsupplier}=useTotalSupplier()

  const { data:totalcustomers}=useTotalCustomers({store_id:1})
   const { data:totalNetAmount}=useTotalNetAmount({store_id:1})
      const { data:todaysaleNetAmount}=useTodayNetAmount({store_id:1})
       const { data:todayPurchaseNetAmount}=usePurchaseTodayNetAmount({store_id:1})
        const { data:totalPurchaseNetAmount}=usePurchaseTotalNetAmount({store_id:1})

   const stats = [
    { title: "Total Sales", value: totalNetAmount?.totalNetAmount, icon: <ShoppingCart className="w-6 h-6 text-blue-600" />, color: "border-blue-300" },
    { title: "Total Medicines", value:totalmedicine?.total, icon: <Package className="w-6 h-6 text-green-600" />, color: "border-green-300" },
    { title: "Total Customers", value: totalcustomers?.total, icon: <Users className="w-6 h-6 text-purple-600" />, color: "border-purple-300" },
    { title: "Total Suppliers", value:  totalsupplier?.total, icon: <Truck className="w-6 h-6 text-yellow-600" />, color: "border-yellow-300" },
    { title: "Total Purchase", value: totalPurchaseNetAmount?.totalNetAmount, icon: <AlertTriangle className="w-6 h-6 text-orange-600" />, color: "border-orange-300" },
    { title: "Revenue Summary", value: "₹4,80,000", icon: <DollarSign className="w-6 h-6 text-indigo-600" />, color: "border-indigo-300" },
  ];

  // const lowStock = [
  //   { name: "Paracetamol", qty: 4 },
  //   { name: "Dolo 650", qty: 3 },
  //   { name: "Azithromycin", qty: 2 },
  // ];

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const lowStock = data?.data || [];
   const expiringStock = expiringstock?.data || [];
    // const expiringStock = expiringstock?.data || [];


  return (
    <div className="">
    
    

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
              <p>💰 Total Sales: {todaysaleNetAmount?.todayNetAmount}</p>
              <p>📦 Purchases:{todayPurchaseNetAmount?.todayNetAmount}</p>
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
    <h3 className="text-md font-semibold text-gray-800">
      Low Stock Items (Batch-wise)
    </h3>
  </div>

  <div className="space-y-4 text-sm">
    {lowStock.length === 0 && (
      <p className="text-gray-500">No low stock items 🎉</p>
    )}

    {lowStock.map((item) => (
      <div
        key={item.item_id}
        className="border border-gray-200 rounded-lg p-3"
      >
        {/* Item Name */}
        <p className="font-semibold text-gray-800 mb-2">
          {item.item_name}
        </p>

        {/* Batch List */}
        <ul className="space-y-1">
          {item.batches.map((batch) => (
            <li
              key={batch.stock_id}
              className="flex justify-between text-gray-700 border-b last:border-b-0 pb-1"
            >
              <span>
                Batch: <b>{batch.batch_no || "N/A"}</b>
              </span>

              <span className="text-red-600 font-medium">
                Qty: {batch.qty_in_stock}
              </span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</div>


        {/* Expiry Soon */}
        <div className="bg-white border border-yellow-300 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-yellow-500" />
            <h3 className="text-md font-semibold text-gray-800">Expiring Soon</h3>
          </div>
          <div className="space-y-4 text-sm">
    {expiringStock.length === 0 && (
      <p className="text-gray-500">No low stock items 🎉</p>
    )}

    {expiringStock.map((item) => (
      <div
        key={item.item_id}
        className="border border-gray-200 rounded-lg p-3"
      >
        {/* Item Name */}
        <p className="font-semibold text-gray-800 mb-2">
          {item.item_name}
        </p>

        {/* Batch List */}
        <ul className="space-y-1">
          {item.batches.map((batch) => (
            <li
              key={batch.stock_id}
              className="flex justify-between text-gray-700 border-b last:border-b-0 pb-1"
            >
              <span>
                Batch: <b>{batch.batch_no || "N/A"}</b>
              </span>

              <span className="flex gap-2 font-medium text-sm">
  <span className="text-red-600">
    Qty: {batch.qty_in_stock}
  </span>
  <span className="text-orange-600">
    Expiry: {batch.expiry_date}
  </span>
</span>

            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
        </div>
      </div>
    </div>
  );
}
