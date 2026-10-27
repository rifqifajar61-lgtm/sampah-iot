import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
// Simpan gambar hiasan di: src/assets/layout.png
import layoutDeco from "./assets/layout.png";

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#E4F5EC]">
      {/* Sidebar: tinggi tetap = tinggi layar */}
      <Sidebar />

      {/* Kolom kanan: yang boleh scroll cuma ini */}
      <div className="relative flex-1 flex flex-col overflow-hidden">
        {/* Hiasan pojok kanan bawah, tetap di tempat saat konten di-scroll */}
        <img
          src={layoutDeco}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-0 right-0 z-0 w-[320px] sm:w-[440px]"
        />

        <div className="relative z-10">
          <Navbar />
        </div>
        <main className="relative z-10 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}