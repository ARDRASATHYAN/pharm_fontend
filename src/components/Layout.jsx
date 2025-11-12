import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-16 transition-all duration-300">
        {/* <Topbar /> */}
        {/* ✅ Give main an ID so we can target it for measurement */}
        <main id="main-content" className="flex-1 p-3 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
