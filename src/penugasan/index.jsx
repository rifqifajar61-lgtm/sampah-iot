import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  Search,
  Leaf,
  User,
  CalendarDays,
  Clock,
  MapPin,
  Activity,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getPenugasan,
  deletePenugasan,
  STATUS_LABEL,
} from "../services/penugasanService";
import { getPetugas } from "../services/petugasService";
import { getTempatSampah } from "../services/tempatSampahService";
// Simpan gambar banner di: src/assets/penugasan.png
import bannerPenugasan from "../assets/penugasan.png";

const PAGE_SIZE = 5;

const STATUS_STYLE = {
  belum_mulai: { pill: "bg-[#E4E7EB] text-[#5B6472]", dot: "bg-[#5B6472]" },
  berjalan: { pill: "bg-[#E6F1FB] text-[#2E8BE0]", dot: "bg-[#2E8BE0]" },
  selesai: { pill: "bg-[#E4F5EC] text-[#1E9E63]", dot: "bg-[#1E9E63]" },
};

const CELL = "py-3 pr-2 border-y border-[#E8F0EB] bg-white group-hover:bg-[#F7FCF9]";
const HEAD = "py-3.5 bg-[#EDF7F1]";

function Th({ icon: Icon, children, className = "" }) {
  return (
    <th className={`${HEAD} ${className}`}>
      <span className="inline-flex items-center gap-2">
        <Icon size={16} className="text-[#1B7A4A]" /> {children}
      </span>
    </th>
  );
}

function formatTanggal(t) {
  if (!t) return "-";
  const d = new Date(`${t}T00:00:00`);
  if (Number.isNaN(d.getTime())) return t;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Penugasan() {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(() => getPenugasan());
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState(location.state?.notice || "");

  // Nama petugas & lokasi diambil dari data master, disimpan per-id
  const petugasMap = useMemo(
    () => new Map(getPetugas().map((p) => [String(p.id), p])),
    []
  );
  const tempatMap = useMemo(
    () => new Map(getTempatSampah().map((t) => [String(t.id), t])),
    []
  );

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

  const rowsAll = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        petugas: petugasMap.get(String(d.petugas_id)) || null,
        tempat: tempatMap.get(String(d.tempat_sampah_id)) || null,
      })),
    [data, petugasMap, tempatMap]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rowsAll;
    return rowsAll.filter(
      (r) =>
        (r.petugas?.nama || "").toLowerCase().includes(q) ||
        (r.tempat?.kode_tempat_sampah || "").toLowerCase().includes(q) ||
        (r.tempat?.lokasi || "").toLowerCase().includes(q) ||
        formatTanggal(r.tanggal).toLowerCase().includes(q)
    );
  }, [rowsAll, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalBerjalan = data.filter((d) => d.status === "berjalan").length;
  const totalSelesai = data.filter((d) => d.status === "selesai").length;

  const handleDelete = (r) => {
    const nama = r.petugas?.nama || "petugas";
    if (!window.confirm(`Hapus penugasan ${nama} pada ${formatTanggal(r.tanggal)}?`))
      return;
    deletePenugasan(r.id);
    setData(getPenugasan());
    setNotice("Penugasan berhasil dihapus.");
  };

  return (
    <main className="flex-1 px-5 sm:px-8 py-6 overflow-y-auto">
      {/* BANNER */}
      <header className="relative overflow-hidden rounded-[20px] border border-white/60 shadow-sm bg-[#E4F5EC] mb-5 min-h-[150px] sm:h-[150px]">
        <img
          src={bannerPenugasan}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right-bottom"
        />
        <div className="relative h-full flex flex-col sm:flex-row sm:items-center gap-4 px-5 sm:px-7 py-5 sm:py-0">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] shrink-0 rounded-full bg-white/60 flex items-center justify-center ring-4 ring-white/50">
              <div className="w-[48px] h-[48px] sm:w-[58px] sm:h-[58px] rounded-full bg-gradient-to-br from-[#2DB870] to-[#1B7A4A] flex items-center justify-center text-white shadow-md">
                <ClipboardList size={26} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[26px] sm:text-[30px] font-extrabold tracking-[-0.5px] text-[#0F2E28]">
                  Penugasan
                </h2>
                <Leaf size={24} className="text-[#3DBE72]" />
              </div>
              <p className="text-sm sm:text-[15px] text-[#0F2E28]/75 mt-1">
                Atur jadwal petugas untuk mengosongkan tempat sampah.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:ml-auto sm:self-center">
            {notice && (
              <div
                role="status"
                className="rounded-[10px] bg-[#1B7A4A] text-white text-sm font-medium px-4 py-2.5 shadow-sm"
              >
                {notice}
              </div>
            )}
            <Link
              to="/penugasan/tambah"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#0F5A38] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0B4A2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E9E63]/50"
            >
              <Plus size={18} />
              Tambah penugasan
            </Link>
          </div>
        </div>
      </header>

      {/* DAFTAR PENUGASAN */}
      <section className="rounded-[20px] bg-white border border-[#DDEFE3] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[14px] bg-[#E4F5EC] flex items-center justify-center">
              <ClipboardList size={22} className="text-[#1B7A4A]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#0F2E28]">
              Daftar Penugasan
            </h3>
            <span className="rounded-full bg-[#E4F5EC] text-[#1B7A4A] text-xs font-bold px-2.5 py-1">
              {data.length}
            </span>
          </div>

          <div className="relative sm:w-[360px]">
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
              placeholder="Cari petugas, kode, atau lokasi..."
              className="w-full rounded-full border border-[#DDEFE3] bg-white pl-11 pr-4 py-3 text-sm text-[#14201B] placeholder:text-[#9AA3AE] outline-none transition focus:border-[#1E9E63] focus:ring-2 focus:ring-[#1E9E63]/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[860px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-[13px] font-semibold text-[#5A6B63]">
                <Th icon={CalendarDays} className="pl-4 rounded-l-[12px]">Tanggal</Th>
                <Th icon={User}>Petugas</Th>
                <Th icon={MapPin}>Tempat sampah</Th>
                <Th icon={Clock}>Shift</Th>
                <Th icon={Activity}>Status</Th>
                <Th icon={Settings} className="pr-6 rounded-r-[12px]">Aksi</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const st = STATUS_STYLE[r.status] || STATUS_STYLE.belum_mulai;
                return (
                  <tr key={r.id} className="group">
                    <td
                      className={`${CELL} pl-4 rounded-l-[12px] border-l font-semibold text-[#0F2E28] whitespace-nowrap`}
                    >
                      {formatTanggal(r.tanggal)}
                    </td>
                    <td className={CELL}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#DDF1E5] flex items-center justify-center shrink-0">
                          <User size={18} className="text-[#1B7A4A]" />
                        </div>
                        <p
                          className={`font-bold whitespace-nowrap ${
                            r.petugas ? "text-[#0F2E28]" : "text-[#9AA3AE] italic"
                          }`}
                        >
                          {r.petugas?.nama || "(petugas dihapus)"}
                        </p>
                      </div>
                    </td>
                    <td className={`${CELL} text-[#3F4D47]`}>
                      {r.tempat ? (
                        <div className="flex items-start gap-2">
                          <MapPin
                            size={16}
                            className="text-[#1B7A4A] mt-0.5 shrink-0"
                          />
                          <div className="leading-tight">
                            <p className="font-semibold text-[#0F2E28] whitespace-nowrap">
                              {r.tempat.kode_tempat_sampah}
                            </p>
                            <p className="text-xs text-[#66756F] whitespace-nowrap">
                              {r.tempat.lokasi}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#9AA3AE] italic">
                          (tempat sampah dihapus)
                        </span>
                      )}
                    </td>
                    <td className={`${CELL} text-[#3F4D47] whitespace-nowrap`}>
                      {r.shift}
                    </td>
                    <td className={CELL}>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap ${st.pill}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                        {STATUS_LABEL[r.status] || r.status}
                      </span>
                    </td>
                    <td className={`${CELL} pr-6 rounded-r-[12px] border-r`}>
                      <div className="flex items-center gap-2.5">
                        <Link
                          to={`/penugasan/ubah/${r.id}`}
                          aria-label="Ubah penugasan"
                          className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[#1B7A4A] bg-[#E4F5EC] hover:bg-[#D2EEDD] transition"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(r)}
                          aria-label="Hapus penugasan"
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
                      ? "Tidak ada penugasan yang cocok dengan pencarian."
                      : "Belum ada penugasan. Klik Tambah penugasan untuk memulai."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          <div className="inline-flex flex-wrap items-center gap-3 rounded-[12px] bg-[#EDF7F1] px-4 py-2.5 text-sm text-[#3F4D47]">
            <Info size={18} className="text-[#1B7A4A]" />
            <span>
              Total penugasan:{" "}
              <b className="font-semibold text-[#0F2E28]">{data.length}</b>
            </span>
            <span className="text-[#B7C4BC]">|</span>
            <span>
              Berjalan:{" "}
              <b className="font-semibold text-[#2E8BE0]">{totalBerjalan}</b>
            </span>
            <span className="text-[#B7C4BC]">|</span>
            <span>
              Selesai:{" "}
              <b className="font-semibold text-[#1B7A4A]">{totalSelesai}</b>
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