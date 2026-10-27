import { useState, useMemo, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Pencil,
  Search,
  MapPin,
  Leaf,
  Hash,
  Recycle,
  Gauge,
  Weight,
  Activity,
  ShieldCheck,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getTempatSampah,
  deleteTempatSampah,
  getKondisi,
  BATAS_HAMPIR_PENUH,
  BATAS_PENUH,
} from "../services/tempatSampahService";
// Simpan gambar banner di: src/assets/sampah.png
import bannerSampah from "../assets/kelola.png";

const PAGE_SIZE = 5;

const KONDISI_STYLE = {
  Normal: "bg-[#E4F5EC] text-[#1E9E63]",
  "Hampir Penuh": "bg-[#FCF2DC] text-[#C4901F]",
  Penuh: "bg-[#FBE7E4] text-[#D14B37]",
  "Tidak Aktif": "bg-[#E4E7EB] text-[#5B6472]",
};

const BAR_COLOR = (level) =>
  level >= BATAS_PENUH
    ? "bg-[#E0503A]"
    : level >= BATAS_HAMPIR_PENUH
    ? "bg-[#E0A72E]"
    : "bg-[#1E9E63]";

const STATUS_STYLE = {
  aktif: { pill: "bg-[#E4F5EC] text-[#1E9E63]", dot: "bg-[#1E9E63]" },
  nonaktif: { pill: "bg-[#E4E7EB] text-[#5B6472]", dot: "bg-[#5B6472]" },
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

export default function KelolaSampah() {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(() => getTempatSampah());
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
    if (!q) return data;
    return data.filter(
      (t) =>
        t.kode_tempat_sampah.toLowerCase().includes(q) ||
        t.lokasi.toLowerCase().includes(q) ||
        (t.jenis_sampah ?? "").toLowerCase().includes(q)
    );
  }, [data, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPenuh = data.filter((t) => getKondisi(t) === "Penuh").length;

  const handleDelete = (t) => {
    if (!window.confirm(`Hapus tempat sampah ${t.kode_tempat_sampah}?`)) return;
    deleteTempatSampah(t.id);
    setData(getTempatSampah());
    setNotice("Tempat sampah berhasil dihapus.");
  };

  return (
    <main className="flex-1 px-5 sm:px-8 py-6 overflow-y-auto">
      {/* BANNER */}
      <header className="relative overflow-hidden rounded-[20px] border border-white/60 shadow-sm bg-[#E4F5EC] mb-5 min-h-[150px] sm:h-[150px]">
        <img
          src={bannerSampah}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right-bottom"
        />
        <div className="relative h-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-7 py-5 sm:py-0">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] shrink-0 rounded-full bg-white/60 flex items-center justify-center ring-4 ring-white/50">
              <div className="w-[48px] h-[48px] sm:w-[58px] sm:h-[58px] rounded-full bg-gradient-to-br from-[#2DB870] to-[#1B7A4A] flex items-center justify-center text-white shadow-md">
                <Trash2 size={26} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[26px] sm:text-[30px] font-extrabold tracking-[-0.5px] text-[#0F2E28]">
                  Kelola Sampah
                </h2>
                <Leaf size={24} className="text-[#3DBE72]" />
              </div>
              <p className="text-sm sm:text-[15px] text-[#0F2E28]/75 mt-1">
                Atur tempat sampah dan pantau isinya dari data sensor.
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
              to="/kelola-sampah/tambah"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#0F5A38] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0B4A2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E9E63]/50"
            >
              <Plus size={18} />
              Tambah tempat sampah
            </Link>
          </div>
        </div>
      </header>

      {/* DAFTAR TEMPAT SAMPAH */}
      <section className="rounded-[20px] bg-white border border-[#DDEFE3] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[14px] bg-[#E4F5EC] flex items-center justify-center">
              <Trash2 size={22} className="text-[#1B7A4A]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#0F2E28]">
              Daftar Tempat Sampah
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
              placeholder="Cari kode, lokasi, atau jenis..."
              className="w-full rounded-full border border-[#DDEFE3] bg-white pl-11 pr-4 py-3 text-sm text-[#14201B] placeholder:text-[#9AA3AE] outline-none transition focus:border-[#1E9E63] focus:ring-2 focus:ring-[#1E9E63]/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[940px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-[13px] font-semibold text-[#5A6B63]">
                <Th icon={Hash} className="pl-4 rounded-l-[12px]">Kode</Th>
                <Th icon={MapPin}>Lokasi</Th>
                <Th icon={Recycle}>Jenis</Th>
                <Th icon={Gauge} className="w-44">Isi (sensor)</Th>
                <Th icon={Weight}>Berat</Th>
                <Th icon={Activity}>Kondisi</Th>
                <Th icon={ShieldCheck}>Status</Th>
                <Th icon={Settings} className="pr-6 rounded-r-[12px]">Aksi</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => {
                const kondisi = getKondisi(t);
                const hasSensor = t.level_sampah != null;
                const st = STATUS_STYLE[t.status] || STATUS_STYLE.nonaktif;
                return (
                  <tr key={t.id} className="group">
                    <td className={`${CELL} pl-4 rounded-l-[12px] border-l font-bold text-[#0F2E28] whitespace-nowrap`}>
                      {t.kode_tempat_sampah}
                    </td>
                    <td className={`${CELL} text-[#3F4D47]`}>
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <MapPin size={15} className="text-[#1B7A4A]" />
                        {t.lokasi}
                      </span>
                      {t.keterangan && (
                        <p
                          title={t.keterangan}
                          className="mt-0.5 ml-[21px] max-w-[220px] truncate text-xs text-[#8B968F]"
                        >
                          {t.keterangan}
                        </p>
                      )}
                    </td>
                    <td className={`${CELL} text-[#3F4D47] whitespace-nowrap`}>
                      {t.jenis_sampah || "-"}
                    </td>
                    <td className={`${CELL} pr-4`}>
                      {hasSensor ? (
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 rounded-full bg-[#EEF0F2] overflow-hidden">
                            <div
                              className={`h-full rounded-full ${BAR_COLOR(t.level_sampah)}`}
                              style={{ width: `${Math.min(t.level_sampah, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-[#14201B] w-9 text-right">
                            {t.level_sampah}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#9AA3AE]">Belum ada data</span>
                      )}
                    </td>
                    <td className={`${CELL} text-[#3F4D47] whitespace-nowrap`}>
                      {t.berat_sampah != null ? `${t.berat_sampah} kg` : "-"}
                    </td>
                    <td className={CELL}>
                      <span
                        className={`inline-block rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap ${KONDISI_STYLE[kondisi]}`}
                      >
                        {kondisi}
                      </span>
                    </td>
                    <td className={CELL}>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize ${st.pill}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                        {t.status}
                      </span>
                    </td>
                    <td className={`${CELL} pr-6 rounded-r-[12px] border-r`}>
                      <div className="flex items-center gap-2.5">
                        <Link
                          to={`/kelola-sampah/ubah/${t.id}`}
                          aria-label={`Ubah ${t.kode_tempat_sampah}`}
                          className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[#1B7A4A] bg-[#E4F5EC] hover:bg-[#D2EEDD] transition"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(t)}
                          aria-label={`Hapus ${t.kode_tempat_sampah}`}
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
                  <td colSpan={8} className="py-10 text-center text-[#66756F]">
                    {query
                      ? "Tidak ada tempat sampah yang cocok dengan pencarian."
                      : "Belum ada tempat sampah. Klik Tambah tempat sampah untuk memulai."}
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
              Total tempat sampah:{" "}
              <b className="font-semibold text-[#0F2E28]">{data.length} unit</b>
            </span>
            <span className="text-[#B7C4BC]">|</span>
            <span>
              Penuh:{" "}
              <b className="font-semibold text-[#D14B37]">{totalPenuh} unit</b>
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