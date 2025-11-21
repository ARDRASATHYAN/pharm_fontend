import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  BadgePercent,
  Pill,
  ClipboardList,
  Truck,
  ShoppingCart,
  RotateCcw,
  ArrowRightLeft,
  Package,
  PackageX,
  Boxes,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";



function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

 const navigationItems = [
  // Dashboard
  { icon: <LayoutDashboard size={18} />, name: "Dashboard", href: "/dashboard" },

  // Master data
  { icon: <Users size={18} />, name: "Staff", href: "/staff" },
  { icon: <Store size={18} />, name: "Store", href: "/store" },
  { icon: <BadgePercent size={18} />, name: "HSN", href: "/Hsn" },
  { icon: <Pill size={18} />, name: "Drug Schedule", href: "/drug" },
  { icon: <ClipboardList size={18} />, name: "Items", href: "/items" },
  { icon: <Truck size={18} />, name: "Supplier", href: "/supplier" },

  // Purchase
  {
    icon: <ShoppingCart size={18} />,
    name: "Purchase",
    href: "/purchase/purchaceinvoice",
    subLinks: [
      { name: "Add Purchase", href: "/purchase/addpurchase" },
      { name: "View Invoice", href: "/purchase/purchaceinvoice" },
      { name: "View Purchase Item", href: "/purchase/purchaceitem" },
    ],
  },

  // Purchase Return
  {
    icon: <RotateCcw size={18} />,
    name: "Purchase Return",
    href: "/return/purchacereturn",
    subLinks: [
      { name: "Add Return", href: "/return/addpurchasereturn" },
      { name: "View Return", href: "/purchase/purchacereturn" },
      { name: "View Return Item", href: "/return/returnitem" },
    ],
  },

  // Sales
  {
    icon: <ArrowRightLeft size={18} />,
    name: "Sales",
    href: "/sales/add",
    subLinks: [
      { name: "Add Sales", href: "/sales/add" },
      { name: "View Sales", href: "/sales/list" },
      { name: "View Sales Item", href: "/sales/items" },
    ],
  },

  // Sales Return
  {
    icon: <RotateCcw size={18} />,
    name: "Sales Return",
    href: "/salesreturn/add",
    subLinks: [
      { name: "Add Sales Return", href: "/salesreturn/add" },
      { name: "View Sales Return", href: "/salesreturn/list" },
      { name: "View Sales Return Item", href: "/salesreturn/items" },
    ],
  },

  // Damaged stock
  {
    icon: <PackageX size={18} />,
    name: "Damaged Stock",
    href: "/damaged/add",
    subLinks: [
      { name: "Add Damaged Stock", href: "/damaged/add" },
      { name: "View Damaged Stock", href: "/damaged/list" },
    ],
  },

  // Excess stock
  {
    icon: <Boxes size={18} />,
    name: "Excess Stock",
    href: "/excess/add",
    subLinks: [
      { name: "Add Excess Stock", href: "/excess/add" },
      { name: "View Excess Stock", href: "/excess/list" },
    ],
  },

  // Stock
  {
    icon: <Package size={18} />,
    name: "Stock",
    href: "/stock",
  },

  // Customers
  {
    icon: <User size={18} />,
    name: "Customer",
    href: "/customers",
  },
];


  // Wider on desktop, but still usable collapsed
  const sidebarWidth = isExpanded ? "w-64" : "w-16";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleSubmenu = (name) => {
    setOpenSubmenu((prev) => (prev === name ? null : name));
  };

  return (
    <>
      {/* === Desktop / Tablet Sidebar === */}
      <nav
        className={cn(
          // show from md and above, fixed full height
          "hidden md:flex fixed left-0 top-0 h-screen z-30 flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          sidebarWidth
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo Section */}
        <div className="flex items-center border-b border-gray-200 px-3 py-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966486.png"
            alt="PharmaPro"
            className="h-10 w-10 rounded-md"
          />
          {isExpanded && (
            <span className="ml-2 overflow-hidden">
              <p className="text-[18px] text-blue-700 font-bold whitespace-nowrap">
                PharmaPro
              </p>
              <p className="text-[10px] text-gray-500 whitespace-nowrap">
                Pharmacy System
              </p>
            </span>
          )}
        </div>

        {/* Menu */}
        <ul className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive =
              location.pathname === item.href ||
              item.subLinks?.some((s) => s.href === location.pathname);
            const isOpen = openSubmenu === item.name;

            return (
              <li key={item.name}>
                <div>
                  <button
                    onClick={() =>
                      item.subLinks ? toggleSubmenu(item.name) : navigate(item.href)
                    }
                    className={cn(
                      "flex items-center justify-between px-2 py-2 rounded-md w-full text-left text-sm transition-all",
                      isActive
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl flex-shrink-0">{item.icon}</span>
                      {isExpanded && (
                        <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.name}
                        </span>
                      )}
                    </div>

                    {item.subLinks && isExpanded && (
                      <span className="ml-auto">
                        {isOpen ? (
                          <ChevronDown size={16} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-500" />
                        )}
                      </span>
                    )}
                  </button>

                  {/* Submenu */}
                  {item.subLinks && isOpen && isExpanded && (
                    <ul className="pl-9 mt-1 space-y-1 transition-all duration-200">
                      {item.subLinks.map((sub) => {
                        const subActive = location.pathname === sub.href;
                        return (
                          <li key={sub.name}>
                            <button
                              onClick={() => navigate(sub.href)}
                              className={cn(
                                "block w-full text-left text-xs px-2 py-1.5 rounded-md",
                                subActive
                                  ? "text-blue-600 bg-blue-50"
                                  : "text-gray-700 hover:bg-gray-100"
                              )}
                            >
                              {sub.name}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-gray-200">
          <button
            className="flex items-center gap-2 w-full px-3 py-2 bg-red-500 hover:bg-red-600 rounded-md text-sm text-white font-medium justify-center"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            {isExpanded && "Logout"}
          </button>
        </div>
      </nav>

      {/* === Mobile Bottom Navbar === */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-white border border-gray-200 shadow-lg rounded-full px-4 py-2 flex justify-around items-center w-[94%] max-w-[380px] md:hidden">
        {navigationItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            item.subLinks?.some((s) => s.href === location.pathname);

          return (
            <button
              key={item.name}
              onClick={() => navigate(item.href)}
              className="flex flex-col items-center justify-center text-center"
            >
              <span
                className={cn(
                  "text-xl mb-0.5 transition-colors duration-200",
                  isActive ? "text-blue-600" : "text-gray-600"
                )}
              >
                {item.icon}
              </span>
              <span
                className={cn(
                  "text-[9px] leading-tight",
                  isActive ? "text-blue-600 font-medium" : "text-gray-700"
                )}
              >
                {item.name.length > 10
                  ? item.name.slice(0, 9) + "…"
                  : item.name}
              </span>
            </button>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center text-center text-gray-600 hover:text-red-500"
        >
          <LogOut size={20} />
          <span className="text-[9px] leading-tight">Logout</span>
        </button>
      </div>
    </>
  );
}
