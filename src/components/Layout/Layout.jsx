import { useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import Header from "../Layout/Header";
import { Outlet } from "react-router-dom";
import ToastNotifier from "../ToastNotifier";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ToastNotifier />
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-bg-color p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
