import { useLocation } from "react-router-dom";

export default function Topbar() {
   const location = useLocation();

  // Map route paths to title names
  const routeTitles = {
    "/dashboard": "Dashboard",
    "/medicines": "Medicines",
    "/customers": "Customers",
    "/suppliers": "Suppliers",
    "/sales": "Sales Report",
    "/invoices": "Invoices",
  };

  // Get title based on current path
  const title = routeTitles[location.pathname] || "Dashboard";
  return (
    <header className="bg-white border-b border-gray-200 h-[72.8px] flex justify-between items-center px-6 ">
      <h2 className="text-lg font-semibold text-gray-700">
       {title}
      </h2>
      
    </header>
  );
}
