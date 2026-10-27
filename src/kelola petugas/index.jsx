import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Search,
  User,
  Contact,
  Phone,
  MapPin,
  ShieldCheck,
  Settings,
  SlidersHorizontal,
  Info,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getPetugas, deletePetugas } from "../services/petugasService";
// Simpan gambar banner di: src/assets/petugas.png
import bannerPetugas from "../assets/petugas.png";

const PAGE_SIZE = 5;

const STATUS_STYLE = {
  aktif: { pill: "bg-[#E4F5EC] text-[#1E9E63]", dot: "bg-[#1E9E63]" },
  nonaktif: { pill: "bg-[#E4E7EB] text-[#5B6472]", dot: "bg-[#5B6472]" },
};

export default function KelolaPetugas() {
  const location = useLocation();
  const navigate = useNavigate();

  const [petugas, setPetugas] = useState(() => getPetugas());
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState(location.state?.notice || "");

  // Bersihkan state history supaya notifikasi tidak muncul lagi saat refresh
  useEffect(() => {
    if (!location.state?.notice) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return petugas;
    return petugas.filter(
      (p) =>
        p.nama.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        p.no_hp.includes(q)
    );
  }, [petugas, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const totalAktif = petugas.filter((p) => p.status === "aktif").length;

  const handleDelete = (p) => {
    if (!window.confirm(`Hapus petugas ${p.nama}?`)) return;
    deletePetugas(p.id);
    setPetugas(getPetugas());
    setNotice("Petugas berhasil dihapus.");
  };

  return (
    <main className="flex-1 px-5 sm:px-8 py-7 overflow-y-auto">
      {/* BANNER */}
      <header
        className="relative overflow-hidden rounded-[20px] border border-white/60 shadow-sm bg-[#E4F5EC] bg-cover bg-center bg-no-repeat mb-5"
        style={{ backgroundImage: `url(${bannerPetugas})` }}
      >
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-7 py-6 sm:py-8 min-h-[150px]">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] shrink-0 rounded-full bg-white/60 flex items-center justify-center ring-4 ring-white/50">
              <div className="w-[48px] h-[48px] sm:w-[58px] sm:h-[58px] rounded-full bg-gradient-to-br from-[#2DB870] to-[#1B7A4A] flex items-center justify-center text-white shadow-md">
                <Users size={26} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[26px] sm:text-[30px] font-extrabold tracking-[-0.5px] text-[#0F2E28]">
                  Kelola Petugas
                </h2>
                <Leaf size={24} className="text-[#3DBE72]" />
              </div>
              <p className="text-sm sm:text-[15px] text-[#0F2E28]/75 mt-1">
                Tambah, ubah, dan atur akun petugas kebersihan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:self-center">
            {notice && (
              <div
                role="status"
                className="rounded-[10px] bg-[#1B7A4A] text-white text-sm font-medium px-4 py-2.5 shadow-sm"
              >
                {notice}
              </div>
            )}
            <Link
              to="/kelola-petugas/tambah"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#0F5A38] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0B4A2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E9E63]/50"
            >
              <UserPlus size={18} />
              Tambah petugas
            </Link>
          </div>
        </div>
      </header>

      {/* DAFTAR PETUGAS */}
      <section className="rounded-[20px] bg-white border border-[#DDEFE3] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[14px] bg-[#E4F5EC] flex items-center justify-center">
              <Users size={22} className="text-[#1B7A4A]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#0F2E28]">
              Daftar Petugas
            </h3>
            <span className="rounded-full bg-[#E4F5EC] text-[#1B7A4A] text-xs font-bold px-2.5 py-1">
              {petugas.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative sm:w-[360px] flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B7A4A]"
              />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari nama, username, atau no. HP..."
                className="w-full rounded-full border border-[#DDEFE3] bg-white pl-11 pr-4 py-3 text-sm text-[#14201B] placeholder:text-[#9AA3AE] outline-none transition focus:border-[#1E9E63] focus:ring-2 focus:ring-[#1E9E63]/20"
              />
            </div>
            <button
              type="button"
              aria-label="Filter"
              className="w-12 h-12 shrink-0 rounded-[14px] border border-[#DDEFE3] bg-white flex items-center justify-center text-[#1B7A4A] hover:bg-[#F1FAF5] transition"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-[13px] font-semibold text-[#5A6B63]">
                <th className="py-3.5 pl-4 rounded-l-[12px] bg-[#EDF7F1]">
                  <span className="inline-flex items-center gap-3">
                    <User size={17} className="text-[#1B7A4A]" /> Petugas
                  </span>
                </th>
                <th className="py-3.5 bg-[#EDF7F1]">
                  <span className="inline-flex items-center gap-2">
                    <Contact size={17} className="text-[#1B7A4A]" /> Username
                  </span>
                </th>
                <th className="py-3.5 bg-[#EDF7F1]">
                  <span className="inline-flex items-center gap-2">
                    <Phone size={17} className="text-[#1B7A4A]" /> No. HP
                  </span>
                </th>
                <th className="py-3.5 bg-[#EDF7F1]">
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={17} className="text-[#1B7A4A]" /> Alamat
                  </span>
                </th>
                <th className="py-3.5 bg-[#EDF7F1]">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={17} className="text-[#1B7A4A]" /> Status
                  </span>
                </th>
                <th className="py-3.5 pr-6 rounded-r-[12px] bg-[#EDF7F1]">
                  <span className="inline-flex items-center gap-2">
                    <Settings size={17} className="text-[#1B7A4A]" /> Aksi
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const st = STATUS_STYLE[p.status] || STATUS_STYLE.nonaktif;
                return (
                  <tr key={p.id} className="group">
                    <td className="py-3 pl-4 rounded-l-[12px] border-y border-l border-[#E8F0EB] bg-white group-hover:bg-[#F7FCF9]">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#DDF1E5] flex items-center justify-center shrink-0">
                          <User size={20} className="text-[#1B7A4A]" />
                        </div>
                        <p className="font-bold text-[#0F2E28] whitespace-nowrap">
                          {p.nama}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 pr-2 border-y border-[#E8F0EB] bg-white group-hover:bg-[#F7FCF9] text-[#3F4D47] whitespace-nowrap">
                      {p.username}
                    </td>
                    <td className="py-3 pr-2 border-y border-[#E8F0EB] bg-white group-hover:bg-[#F7FCF9] text-[#3F4D47] whitespace-nowrap">
                      {p.no_hp}
                    </td>
                    <td className="py-3 pr-2 border-y border-[#E8F0EB] bg-white group-hover:bg-[#F7FCF9] text-[#3F4D47] max-w-[240px]">
                      <div className="flex items-start gap-2" title={p.alamat}>
                        <MapPin
                          size={16}
                          className="text-[#1B7A4A] mt-0.5 shrink-0"
                        />
                        <span className="line-clamp-2">{p.alamat}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-2 border-y border-[#E8F0EB] bg-white group-hover:bg-[#F7FCF9]">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${st.pill}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 pr-6 rounded-r-[12px] border-y border-r border-[#E8F0EB] bg-white group-hover:bg-[#F7FCF9]">
                      <div className="flex items-center gap-2.5">
                        <Link
                          to={`/kelola-petugas/ubah/${p.id}`}
                          aria-label={`Ubah ${p.nama}`}
                          className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[#1B7A4A] bg-[#E4F5EC] hover:bg-[#D2EEDD] transition"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          aria-label={`Hapus ${p.nama}`}
                          className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[#D93025] bg-[#FDE8E6] hover:bg-[#FAD4D0] transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#66756F]">
                    {query
                      ? "Tidak ada petugas yang cocok dengan pencarian."
                      : "Belum ada petugas. Klik Tambah petugas untuk memulai."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          <div className="inline-flex items-center gap-3 rounded-[12px] bg-[#EDF7F1] px-4 py-2.5 text-sm text-[#3F4D47]">
            <Info size={18} className="text-[#1B7A4A]" />
            <span>
              Total petugas:{" "}
              <b className="font-semibold text-[#0F2E28]">{petugas.length} orang</b>
            </span>
            <span className="text-[#B7C4BC]">|</span>
            <span>
              Petugas aktif:{" "}
              <b className="font-semibold text-[#1B7A4A]">{totalAktif} orang</b>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Halaman sebelumnya"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="w-9 h-9 rounded-[10px] border border-[#DDEFE3] flex items-center justify-center text-[#5A6B63] hover:bg-[#F1FAF5] disabled:opacity-40 disabled:hover:bg-transparent transition"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={n === currentPage ? "page" : undefined}
                className={`w-9 h-9 rounded-[10px] text-sm font-semibold transition ${
                  n === currentPage
                    ? "bg-[#4DB37E] text-white"
                    : "border border-[#DDEFE3] text-[#5A6B63] hover:bg-[#F1FAF5]"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              aria-label="Halaman berikutnya"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="w-9 h-9 rounded-[10px] border border-[#DDEFE3] flex items-center justify-center text-[#5A6B63] hover:bg-[#F1FAF5] disabled:opacity-40 disabled:hover:bg-transparent transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}