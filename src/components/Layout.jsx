import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div className="flex  min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-16 transition-all duration-300 over ">
        {/* <Topbar /> */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
