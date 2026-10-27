
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Trash2,
  Users,
  ClipboardList,
  X,
} from "lucide-react";

import logo from "../assets/logo.png";
import ramai from "../assets/sidebar.png";
import sampah from "../assets/sampah.png";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Kelola Petugas", icon: Users, path: "/kelola-petugas" },
  { label: "Kelola Sampah", icon: Trash2, path: "/kelola-sampah" },
  { label: "Penugasan", icon: ClipboardList, path: "/penugasan" },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[270px] shrink-0 flex-col overflow-hidden bg-cover bg-center bg-no-repeat text-[#0F2E28] shadow-xl transition-transform duration-300 ease-in-out lg:relative lg:inset-auto lg:z-auto lg:translate-x-0 lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ backgroundImage: `url(${ramai})` }}
      aria-label="Navigasi utama"
      aria-hidden={!isOpen && undefined}
    >
      {/* Logo dan tombol tutup mobile */}
      <div className="flex items-center justify-between gap-3 px-6 py-6">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="h-11 w-11 shrink-0 object-contain"
          />

          <p className="text-[17px] font-bold leading-tight">
            Sistem Monitoring
            <br />
            Sampah
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup sidebar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#0F2E28] transition hover:bg-white/50 lg:hidden"
        >
          <X size={22} />
        </button>
      </div>

      {/* Menu navigasi */}
      <nav className="flex flex-col gap-4 px-4 pt-6">
        <p className="px-5 text-[12px] font-semibold uppercase tracking-widest text-[#0F2E28]/50">
          Menu
        </p>

        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const active =
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`);

          return (
            <Link
              key={label}
              to={path}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-[12px] px-5 py-4 text-left text-[16px] font-medium transition ${
                active
                  ? "bg-[#1B7A4A] font-semibold text-white shadow-sm"
                  : "text-[#0F2E28]/80 hover:bg-white/40 hover:text-[#0F2E28]"
              }`}
            >
              <Icon size={20} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Dekorasi bawah */}
      <div className="mt-auto flex items-end justify-center">
        <img
          src={sampah}
          alt="Tempat sampah"
          className="h-auto w-[320px] max-w-none select-none object-contain drop-shadow-md"
        />
      </div>
    </aside>
  );
}
