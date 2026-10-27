import { Link, useNavigate } from "react-router-dom";
import { Menu, Bell, ChevronDown, User, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Hapus data sesi/token sesuai kebutuhan aplikasi kamu
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between gap-4 px-5 sm:px-8 py-4 bg-[#FAF9F5] border-b border-black/5">

      <button className="lg:hidden text-[#1B2733]">
        <Menu size={22} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">

        <Link
          to="/notifikasi"
          className="relative w-9 h-9 rounded-full flex items-center justify-center text-[#4B5967] hover:bg-black/5 transition"
        >
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E0503A]" />
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 active:bg-red-800 transition"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-black/10">
          <div className="w-8 h-8 rounded-full bg-[#D9DEE3] flex items-center justify-center">
            <User size={16} className="text-[#5B6472]" />
          </div>
          <span className="text-sm font-semibold text-[#1B2733]">Admin</span>
          <ChevronDown size={15} className="text-[#5B6472]" />
        </div>

      </div>

    </header>
  );
}