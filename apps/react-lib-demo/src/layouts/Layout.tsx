import { useState } from "react";
import { Outlet } from "react-router";
import AppBar from "./AppBar";
import SideMenu from "./SideMenu";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar onToggleSidebar={toggleSidebar} />

      <div className="relative">
        <SideMenu isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main Content */}
        <main className="w-full">
          <div className="max-w-6xl mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
