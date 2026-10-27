import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Trash2,
  Users,
  ClipboardList,
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

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      className="hidden lg:flex flex-col w-[270px] shrink-0 overflow-hidden text-[#0F2E28] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${ramai})` }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <img src={logo} alt="Logo" className="w-11 h-11 object-contain shrink-0" />
        <p className="text-[17px] font-bold leading-tight">
          Sistem Monitoring
          <br />
          Sampah
        </p>
      </div>

      {/* Menu navigasi */}
      <nav className="flex flex-col gap-4 px-4 pt-6">
        <p className="px-5 text-[12px] font-semibold tracking-widest text-[#0F2E28]/50 uppercase">
          Menu
        </p>

        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={label}
              to={path}
              className={`flex items-center gap-3 rounded-[12px] px-5 py-4 text-[16px] font-medium text-left transition ${
                active
                  ? "bg-[#1B7A4A] text-white font-semibold shadow-sm"
                  : "text-[#0F2E28]/80 hover:bg-white/40 hover:text-[#0F2E28]"
              }`}
            >
              <Icon size={20} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Dekorasi bawah: tong sampah (lebih besar) */}
      <div className="mt-auto flex items-end justify-center">
        <img
          src={sampah}
          alt="Tempat sampah"
          className="w-[320px] max-w-none h-auto object-contain select-none pointer-events-none drop-shadow-md"
        />
      </div>
    </aside>
  );
}