import {
  Trash2,
  Users,
  MapPin,
  Calendar,
  Wifi,
  Truck,
  Recycle,
  User,
} from "lucide-react";
import bannerBg from "../assets/welcome.png";
import waveDecor from "../assets/lengkung.png";
import trashBin from "../assets/hiasan.png";

const STAT_CARDS = [
  {
    label: "Total Tong Sampah",
    value: "24",
    sub: "Unit terpasang",
    icon: Trash2,
    bg: "bg-[#E4F5EC]",
    fg: "text-[#1E9E63]",
  },
  {
    label: "Tong Sampah Penuh",
    value: "3",
    sub: "Perlu diambil",
    icon: Wifi,
    bg: "bg-[#E6F1FB]",
    fg: "text-[#2E8BE0]",
  },
  {
    label: "Sedang Dikosongkan",
    value: "5",
    sub: "Unit",
    icon: Truck,
    bg: "bg-[#FCF2DC]",
    fg: "text-[#D89A2B]",
  },
  {
    label: "Lokasi Aktif",
    value: "18",
    sub: "Titik lokasi",
    icon: MapPin,
    bg: "bg-[#F3E9FB]",
    fg: "text-[#9152C9]",
  },
];

const BIN_STATUS = [
  { label: "Normal", value: "16", dot: "bg-[#1FA463]", bin: "text-[#1FA463]" },
  { label: "Hampir Penuh", value: "5", dot: "bg-[#E0A72E]", bin: "text-[#E0A72E]" },
  { label: "Penuh", value: "3", dot: "bg-[#E0503A]", bin: "text-[#E0503A]" },
  { label: "Tidak Aktif", value: "0", dot: "bg-[#9AA3AE]", bin: "text-[#9AA3AE]" },
];

const KINERJA = [
  { nama: "Andi Setiawan", selesai: 12, berjalan: 2, persen: 86 },
  { nama: "Budi Santoso", selesai: 10, berjalan: 4, persen: 71 },
  { nama: "Siti Nurhaliza", selesai: 9, berjalan: 3, persen: 75 },
  { nama: "Rudi Hartono", selesai: 8, berjalan: 5, persen: 62 },
];

export default function Dashboard() {
  return (
    <main className="flex-1 px-5 sm:px-8 py-6 overflow-y-auto">
      {/* ================= WELCOME BANNER ================= */}
      <div
        className="relative overflow-hidden rounded-[20px] px-7 py-5 mb-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <div className="absolute inset-0 bg-white/20" />

        <img
          src={waveDecor}
          alt=""
          className="absolute -bottom-16 -right-10 w-[480px] md:w-[620px] h-16 md:h-24 object-cover object-bottom pointer-events-none select-none z-[1] opacity-70"
        />
        <img
          src={waveDecor}
          alt=""
          className="absolute -bottom-16 -left-10 w-[480px] md:w-[620px] h-16 md:h-24 object-cover object-bottom pointer-events-none select-none z-[1] opacity-70 scale-x-[-1]"
        />

        <div className="relative z-10 flex items-center justify-between gap-6">
          <div className="max-w-md">
            <p className="text-[14px] font-medium text-[#1B7A4A]">Selamat Datang,</p>
            <h1 className="text-[26px] font-bold text-[#0F2E28] mt-0.5">Admin 👋</h1>
            <p className="text-[13px] text-[#0F2E28]/70 mt-1.5 leading-relaxed">
              Pantau dan kelola sistem Smart Trash Bin untuk lingkungan yang
              lebih bersih dan sehat.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-medium text-[#1B2733]">
              <Calendar size={14} className="text-[#1B7A4A]" />
              Senin, 15 September 2025
            </div>
          </div>

          <div className="relative shrink-0 hidden sm:flex items-center justify-center">
            <div className="absolute w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/70 ring-8 ring-white/40 shadow-lg" />
            <img
              src={trashBin}
              alt="Smart Trash Bin"
              className="w-24 md:w-28 h-auto object-contain relative z-10 drop-shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {STAT_CARDS.map(({ label, value, sub, icon: Icon, bg, fg }) => (
          <div
            key={label}
            className={`rounded-[16px] p-4 ${bg} border border-black/5 flex items-center gap-4`}
          >
            <div
              className={`w-11 h-11 shrink-0 rounded-[12px] bg-white/70 flex items-center justify-center ${fg}`}
            >
              <Icon size={22} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#41504A] truncate">{label}</p>
              <p className="text-2xl font-extrabold text-[#14201B] leading-tight">
                {value}
              </p>
              <p className="text-[11px] text-[#66756F]">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MONITORING + KINERJA ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-4">
        <section className="rounded-[16px] bg-white border border-black/5 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 size={18} className="text-[#1E9E63]" />
            <h2 className="text-[16px] font-bold text-[#14201B]">
              Monitoring Tong Sampah
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {BIN_STATUS.map(({ label, value, dot, bin }) => (
              <div
                key={label}
                className="rounded-[12px] border border-black/5 bg-[#FAFAF8] flex flex-col items-center py-4"
              >
                <Recycle size={30} strokeWidth={1.8} className={bin} />
                <span className={`mt-2 w-2 h-2 rounded-full ${dot}`} />
                <p className="mt-1 text-xs font-semibold text-[#41504A]">{label}</p>
                <p className="text-2xl font-extrabold text-[#14201B]">{value}</p>
                <p className="text-[11px] text-[#8B968F]">Unit</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[16px] bg-white border border-black/5 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-[#1E9E63]" />
            <h2 className="text-[16px] font-bold text-[#14201B]">Kinerja Petugas</h2>
          </div>

          <div className="flex flex-col divide-y divide-black/5">
            {KINERJA.map(({ nama, selesai, berjalan, persen }) => (
              <div key={nama} className="py-2.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#E9ECEF] flex items-center justify-center shrink-0">
                  <User size={15} className="text-[#8B968F]" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1B2733] truncate">
                    {nama}
                  </p>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-[#EEF0F2] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        persen >= 70 ? "bg-[#1E9E63]" : "bg-[#E0A72E]"
                      }`}
                      style={{ width: `${persen}%` }}
                    />
                  </div>
                </div>

                <span className="text-xs text-[#66756F] w-12 text-center shrink-0">
                  {selesai}/{berjalan}
                </span>
                <span className="text-sm font-bold text-[#14201B] w-10 text-right shrink-0">
                  {persen}%
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}