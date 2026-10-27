
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import layoutDeco from "./assets/layout.png";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#E4F5EC]">
      {/* Overlay untuk menutup sidebar di HP */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={closeSidebar}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar desktop dan mobile */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* Kolom kanan */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Dekorasi pojok kanan bawah */}
        <img
          src={layoutDeco}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 z-0 w-[320px] select-none sm:w-[440px]"
        />

        {/* Navbar */}
        <div className="relative z-10">
          <Navbar onMenuClick={toggleSidebar} />
        </div>

        {/* Konten halaman */}
        <main className="relative z-10 min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
