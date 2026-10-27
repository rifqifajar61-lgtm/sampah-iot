
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between gap-4 border-b border-black/5 bg-[#FAF9F5] px-5 py-4 sm:px-8">
      {/* Tombol hamburger untuk HP */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Buka atau tutup menu"
        aria-expanded={undefined}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#1B2733] transition hover:bg-black/5 active:bg-black/10 lg:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Ruang kosong untuk desktop */}
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/notifikasi"
          aria-label="Notifikasi"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#4B5967] transition hover:bg-black/5"
        >
          <Bell size={19} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#E0503A]" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 active:bg-red-800"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>

        <div className="flex items-center gap-2 border-l border-black/10 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D9DEE3]">
            <User size={16} className="text-[#5B6472]" />
          </div>

          <span className="text-sm font-semibold text-[#1B2733]">
            Admin
          </span>

          <ChevronDown
            size={15}
            className="text-[#5B6472]"
          />
        </div>
      </div>
    </header>
  );
}
