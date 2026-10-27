import { useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  Plus,
  Pencil,
  Save,
  X,
  Leaf,
  User,
  Trash2,
  CalendarDays,
  StickyNote,
} from "lucide-react";
import {
  STATUS_OPTIONS,
  STATUS_LABEL,
  addPenugasan,
  updatePenugasan,
  getPenugasanById,
  isJadwalBentrok,
} from "../services/penugasanService";
import { getPetugas } from "../services/petugasService";
import { getTempatSampah } from "../services/tempatSampahService";
// Banner yang sama dengan halaman lain
import bannerPetugas from "../assets/penugasan.png";

const inputBase =
  "w-full rounded-[12px] border bg-white py-3 text-sm text-[#14201B] placeholder:text-[#9AA3AE] outline-none transition focus:border-[#1E9E63] focus:ring-2 focus:ring-[#1E9E63]/20";

const STATUS_ACTIVE = {
  belum_mulai: { box: "border-[#9AA3AE] bg-[#E4E7EB] text-[#41504A]", dot: "bg-[#5B6472]" },
  berjalan: { box: "border-[#2E8BE0] bg-[#E6F1FB] text-[#2E8BE0]", dot: "bg-[#2E8BE0]" },
  selesai: { box: "border-[#1E9E63] bg-[#E4F5EC] text-[#1B7A4A]", dot: "bg-[#1E9E63]" },
};

function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function Field({ label, hint, error, icon: Icon, iconTop, children }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#41504A] mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className={`absolute left-3.5 text-[#1B7A4A] pointer-events-none ${
              iconTop ? "top-3.5" : "top-1/2 -translate-y-1/2"
            }`}
          />
        )}
        {children}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-[#D14B37]">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-[#8B968F]">{hint}</p>
      )}
    </div>
  );
}

// Dipakai untuk dua route:
//   /penugasan/tambah      -> tambah penugasan baru
//   /penugasan/ubah/:id    -> ubah penugasan yang sudah ada
export default function CreatePenugasan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const existing = isEditing ? getPenugasanById(id) : null;

  const petugasAll = useMemo(() => getPetugas(), []);
  const tempatAll = useMemo(() => getTempatSampah(), []);

  // Petugas nonaktif tidak bisa dipilih, kecuali yang sedang dipakai saat ubah
  const petugasOptions = useMemo(
    () =>
      petugasAll.filter(
        (p) =>
          p.status === "aktif" ||
          (existing && String(p.id) === String(existing.petugas_id))
      ),
    [petugasAll, existing]
  );

  const [form, setForm] = useState(() =>
    existing
      ? {
          petugas_id: String(existing.petugas_id),
          tempat_sampah_id: String(existing.tempat_sampah_id),
          tanggal_mulai: existing.tanggal_mulai,
          tanggal_selesai: existing.tanggal_selesai,
          status: existing.status,
          keterangan: existing.keterangan || "",
        }
      : {
          petugas_id: "",
          tempat_sampah_id: "",
          tanggal_mulai: todayISO(),
          tanggal_selesai: todayISO(),
          status: "belum_mulai",
          keterangan: "",
        }
  );
  const [errors, setErrors] = useState({});

  if (isEditing && !existing) {
    return (
      <main className="flex-1 px-5 sm:px-8 py-7 overflow-y-auto">
        <div className="rounded-[20px] bg-white border border-[#DDEFE3] p-8 shadow-sm max-w-xl">
          <h2 className="text-[20px] font-bold text-[#0F2E28]">
            Penugasan tidak ditemukan
          </h2>
          <p className="text-sm text-[#66756F] mt-2">
            Data dengan ID {id} tidak ada atau sudah dihapus.
          </p>
          <Link
            to="/penugasan"
            className="inline-flex items-center gap-2 mt-5 rounded-full bg-[#0F5A38] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0B4A2E] transition"
          >
            <ArrowLeft size={16} />
            Kembali ke daftar penugasan
          </Link>
        </div>
      </main>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.petugas_id) er.petugas_id = "Pilih petugas.";
    if (!form.tempat_sampah_id) er.tempat_sampah_id = "Pilih tempat sampah.";
    if (!form.tanggal_mulai) er.tanggal_mulai = "Tanggal mulai wajib diisi.";
    if (!form.tanggal_selesai) {
      er.tanggal_selesai = "Tanggal selesai wajib diisi.";
    } else if (form.tanggal_mulai && form.tanggal_selesai < form.tanggal_mulai) {
      er.tanggal_selesai = "Tanggal selesai tidak boleh sebelum tanggal mulai.";
    }

    if (
      !er.petugas_id &&
      !er.tanggal_mulai &&
      !er.tanggal_selesai &&
      isJadwalBentrok(form, id)
    ) {
      er.tanggal_mulai = "Petugas ini sudah punya tugas di rentang tanggal tersebut.";
    }
    return er;
  };

  const handleSubmit = () => {
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) return;

    const data = {
      petugas_id: form.petugas_id,
      tempat_sampah_id: form.tempat_sampah_id,
      tanggal_mulai: form.tanggal_mulai,
      tanggal_selesai: form.tanggal_selesai,
      status: form.status,
      keterangan: form.keterangan.trim(),
    };

    if (isEditing) {
      updatePenugasan(id, data);
      navigate("/penugasan", {
        state: { notice: "Penugasan berhasil disimpan." },
      });
    } else {
      addPenugasan(data);
      navigate("/penugasan", {
        state: { notice: "Penugasan baru berhasil ditambahkan." },
      });
    }
  };

  const borderFor = (name) =>
    errors[name] ? "border-[#D14B37]" : "border-[#DDEFE3]";

  return (
    <main className="flex-1 px-5 sm:px-8 py-6 overflow-y-auto">
      {/* BANNER */}
      <header className="relative overflow-hidden rounded-[20px] border border-white/60 shadow-sm bg-[#E4F5EC] mb-5 min-h-[150px] sm:h-[150px]">
        <img
          src={bannerPetugas}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right-bottom"
        />
        <div className="relative h-full flex items-center gap-4 sm:gap-5 px-5 sm:px-7 py-5 sm:py-0">
          <div className="w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] shrink-0 rounded-full bg-white/60 flex items-center justify-center ring-4 ring-white/50">
            <div className="w-[48px] h-[48px] sm:w-[58px] sm:h-[58px] rounded-full bg-gradient-to-br from-[#2DB870] to-[#1B7A4A] flex items-center justify-center text-white shadow-md">
              {isEditing ? <Pencil size={24} /> : <ClipboardList size={26} />}
            </div>
          </div>

          <div>
            <Link
              to="/penugasan"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B7A4A] hover:underline"
            >
              <ArrowLeft size={15} />
              Kembali ke daftar penugasan
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-[24px] sm:text-[28px] font-extrabold tracking-[-0.5px] text-[#0F2E28]">
                {isEditing ? "Ubah Penugasan" : "Tambah Penugasan"}
              </h2>
              <Leaf size={22} className="text-[#3DBE72]" />
            </div>
            <p className="text-sm sm:text-[15px] text-[#0F2E28]/75 mt-0.5">
              {isEditing
                ? "Perbarui jadwal dan status penugasan."
                : "Tentukan petugas, tempat sampah, dan rentang tanggal."}
            </p>
          </div>
        </div>
      </header>

      {/* FORM */}
      <section className="rounded-[20px] bg-white border border-[#DDEFE3] p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-[12px] bg-[#E4F5EC] flex items-center justify-center">
            {isEditing ? (
              <Pencil size={18} className="text-[#1B7A4A]" />
            ) : (
              <Plus size={18} className="text-[#1B7A4A]" />
            )}
          </div>
          <h3 className="text-[16px] font-bold text-[#0F2E28]">
            Data Penugasan
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Field
            label="Petugas"
            icon={User}
            error={errors.petugas_id}
            hint={
              petugasOptions.length === 0
                ? "Belum ada petugas aktif. Tambahkan dulu di Kelola Petugas."
                : "Hanya petugas berstatus aktif yang bisa dipilih."
            }
          >
            <select
              name="petugas_id"
              value={form.petugas_id}
              onChange={handleChange}
              className={`${inputBase} pl-11 pr-3.5 ${borderFor("petugas_id")}`}
            >
              <option value="">Pilih petugas</option>
              {petugasOptions.map((p) => (
                <option key={p.id} value={String(p.id)}>
                  {p.nama}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Tempat sampah"
            icon={Trash2}
            error={errors.tempat_sampah_id}
            hint={
              tempatAll.length === 0
                ? "Belum ada tempat sampah. Tambahkan dulu di Kelola Sampah."
                : undefined
            }
          >
            <select
              name="tempat_sampah_id"
              value={form.tempat_sampah_id}
              onChange={handleChange}
              className={`${inputBase} pl-11 pr-3.5 ${borderFor("tempat_sampah_id")}`}
            >
              <option value="">Pilih tempat sampah</option>
              {tempatAll.map((t) => (
                <option key={t.id} value={String(t.id)}>
                  {t.kode_tempat_sampah} - {t.lokasi}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tanggal mulai" icon={CalendarDays} error={errors.tanggal_mulai}>
            <input
              type="date"
              name="tanggal_mulai"
              value={form.tanggal_mulai}
              onChange={handleChange}
              className={`${inputBase} pl-11 pr-3.5 ${borderFor("tanggal_mulai")}`}
            />
          </Field>

          <Field label="Tanggal selesai" icon={CalendarDays} error={errors.tanggal_selesai}>
            <input
              type="date"
              name="tanggal_selesai"
              value={form.tanggal_selesai}
              min={form.tanggal_mulai}
              onChange={handleChange}
              className={`${inputBase} pl-11 pr-3.5 ${borderFor("tanggal_selesai")}`}
            />
          </Field>

          <div className="sm:col-span-2">
            <span className="block text-[13px] font-semibold text-[#41504A] mb-1.5">
              Status
            </span>
            <div className="grid grid-cols-3 gap-2 sm:max-w-md">
              {STATUS_OPTIONS.map((s) => {
                const active = form.status === s;
                const st = STATUS_ACTIVE[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    aria-pressed={active}
                    className={`inline-flex items-center justify-center gap-2 rounded-[12px] border py-2.5 text-sm font-semibold transition ${
                      active
                        ? st.box
                        : "border-[#DDEFE3] bg-white text-[#8B968F] hover:bg-[#F7FCF9]"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        active ? st.dot : "bg-[#C9D2CD]"
                      }`}
                    />
                    {STATUS_LABEL[s]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Field
              label="Keterangan (opsional)"
              icon={StickyNote}
              iconTop
              hint="Contoh: bawa kantong tambahan, akses lewat pintu belakang."
            >
              <textarea
                name="keterangan"
                rows={3}
                value={form.keterangan}
                onChange={handleChange}
                placeholder="Tulis keterangan untuk petugas"
                className={`${inputBase} resize-none pl-11 pr-3.5 border-[#DDEFE3]`}
              />
            </Field>
          </div>
        </div>

        {/* AKSI */}
        <div className="flex items-center justify-end gap-3 mt-7 pt-5 border-t border-[#E8F0EB]">
          <Link
            to="/penugasan"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#DDEFE3] bg-white px-6 py-3 text-sm font-semibold text-[#41504A] transition hover:bg-[#F1FAF5]"
          >
            <X size={16} />
            Batal
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F5A38] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0B4A2E] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E9E63]/50"
          >
            <Save size={16} />
            {isEditing ? "Simpan perubahan" : "Tambah penugasan"}
          </button>
        </div>
      </section>
    </main>
  );
}