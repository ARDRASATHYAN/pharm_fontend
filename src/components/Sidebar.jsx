import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard, RxClipboard } from "react-icons/rx";
import { LogOut, ChevronDown, ChevronRight, Tag } from "lucide-react";
import { FaUserMd, FaUsers, FaPills, FaTruck, FaStore, FaClipboardList, FaUser } from "react-icons/fa";
import { MdPointOfSale } from "react-icons/md";
import { GiMedicinePills } from "react-icons/gi";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null); // Track which submenu is open
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { icon: <RxDashboard />, name: "Dashboard", href: "/dashboard" },
    // {
    //   icon: <FaPills />,
    //   name: "Medicines",
    //   href: "/medicines",
    //   subLinks: [
    //     { name: "Add Medicine", href: "/medicines/add" },
    //     { name: "Stock List", href: "/medicines/stock" },
    //     { name: "Categories", href: "/medicines/categories" },
    //   ],
    // },
    // { icon: <MdPointOfSale />, name: "Sales", href: "/sales" },
    // { icon: <FaTruck />, name: "Suppliers", href: "/suppliers" },
    // { icon: <FaUserMd />, name: "Customers", href: "/customers" },
    // {
    //   icon: <RxClipboard />,
    //   name: "Reports",
    //   href: "/reports",
    //   subLinks: [
    //     { name: "Sales Report", href: "/reports/sales" },
    //     { name: "Stock Report", href: "/reports/stock" },
    //   ],
    // },
    
    {
      icon: <FaUsers />,
      name: "Staff",
      href: "/staff",
      // subLinks: [
      //   { name: "Add Staff", href: "/staff/add" },
      //   { name: "Attendance", href: "/staff/attendance" },
      // ],
    },
    {
      icon: <FaStore />,
      name: "Store",
      href: "/store",
      // subLinks: [
      //   { name: "Add store", href: "/store/add" },
      //   { name: "store List", href: "/store/stock" },
      // ],
    },
     {
      icon: <Tag />,
      name: "Hsn",
      href: "/Hsn",
      // subLinks: [
      //   { name: "Add Hsn", href: "/hsn/add" },
      //   { name: "Hsn List", href: "/hsn/stock" },
      // ],
    },
    {
      icon: <GiMedicinePills />,
      name: "DrugSchedule",
      href: "/drug",
      // subLinks: [
      //   { name: "Add drug", href: "/drug/add" },
      //   { name: "drug List", href: "/drug/stock" },
      // ],
    },
     {
      icon: <FaClipboardList />,
    name: "Items",
      href: "/items",

      // subLinks: [
      //   { name: "Add drug", href: "/drug/add" },
      //   { name: "drug List", href: "/drug/stock" },
      // ],
    },
    {
      icon: <FaTruck />,
    name: "Supplier",
      href: "/supplier",

      // subLinks: [
      //   { name: "Add drug", href: "/drug/add" },
      //   { name: "drug List", href: "/drug/stock" },
      // ],
    },
    {
      icon: <FaUser />,
    name: "Customers",
      href: "/customers",

      // subLinks: [
      //   { name: "Add drug", href: "/drug/add" },
      //   { name: "drug List", href: "/drug/stock" },
      // ],
    },
  ];

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
      {/* === Desktop Sidebar === */}
      <nav
        className={cn(
          "hidden md:flex fixed left-0 top-0 h-screen z-30 flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          sidebarWidth
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo Section */}
        <div className="flex items-center border-b border-gray-200 p-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966486.png"
            alt="PharmaPro"
            className="h-[40px] w-[40px] rounded-md"
          />
          {isExpanded && (
            <span className="ml-2">
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
        <ul className="flex-1 p-3 space-y-1 overflow-y-auto">
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
                      "flex items-center justify-between p-2 rounded-md w-full text-left transition-all",
                      isActive
                        ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      {isExpanded && (
                        <span className="text-sm font-medium whitespace-nowrap">
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
                    <ul className="pl-10 mt-1 space-y-1 transition-all duration-200">
                      {item.subLinks.map((sub) => {
                        const subActive = location.pathname === sub.href;
                        return (
                          <li key={sub.name}>
                            <button
                              onClick={() => navigate(sub.href)}
                              className={cn(
                                "block w-full text-left text-sm p-2 rounded-md",
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
        <div className="p-3 border-t border-gray-200">
          <button
            className="flex items-center gap-2 w-full p-2 bg-red-500 hover:bg-red-600 rounded-md text-sm text-white font-medium justify-center"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            {isExpanded && "Logout"}
          </button>
        </div>
      </nav>

      {/* === Mobile Navbar === */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white border border-gray-200 shadow-lg rounded-full px-5 py-2 flex justify-around items-center w-[90%] max-w-[380px] md:hidden">
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
                  "text-2xl mb-1 transition-colors duration-200",
                  isActive ? "text-blue-600" : "text-gray-600"
                )}
              >
                {item.icon}
              </span>
              <span
                className={cn(
                  "text-[10px]",
                  isActive ? "text-blue-600 font-medium" : "text-gray-700"
                )}
              >
                {item.name}
              </span>
            </button>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center text-center text-gray-600 hover:text-red-500"
        >
          <LogOut size={22} />
          <span className="text-[10px]">Logout</span>
        </button>
      </div>
    </>
  );
}
