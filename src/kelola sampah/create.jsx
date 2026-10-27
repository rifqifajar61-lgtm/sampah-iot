import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Save,
  X,
  Trash2,
  Leaf,
  Hash,
  Tag,
  MapPin,
  Recycle,
  ChevronDown,
} from "lucide-react";
import {
  STATUS_OPTIONS,
  addTempatSampah,
  updateTempatSampah,
  getTempatSampahById,
  isKodeTaken,
  nextKode,
} from "../services/tempatSampahService";
// Banner yang sama dengan halaman Kelola Sampah
import bannerSampah from "../assets/kelola.png";

const inputBase =
  "w-full rounded-[12px] border bg-white py-3 text-sm text-[#14201B] placeholder:text-[#9AA3AE] outline-none transition focus:border-[#1E9E63] focus:ring-2 focus:ring-[#1E9E63]/20";

// Pilihan jenis sampah (disimpan ke kolom jenis_sampah)
const JENIS_SAMPAH_OPTIONS = ["Organik", "Anorganik", "B3", "Campuran"];

function Field({ label, hint, error, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-[#41504A] mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1B7A4A] pointer-events-none"
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
//   /kelola-sampah/tambah      -> tambah tempat sampah baru
//   /kelola-sampah/ubah/:id    -> ubah tempat sampah yang sudah ada
//
// Field form mengikuti tabel `tempat_sampah`:
//   kode_tempat_sampah (varchar), nama_tempat_sampah (varchar),
//   lokasi (varchar), jenis_sampah (varchar), keterangan (text), status (enum)
// id, created_at, updated_at diisi otomatis oleh database.
export default function CreateSampah() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const existing = isEditing ? getTempatSampahById(id) : null;

  const [form, setForm] = useState(() =>
    existing
      ? {
          kode_tempat_sampah: existing.kode_tempat_sampah,
          nama_tempat_sampah: existing.nama_tempat_sampah ?? "",
          lokasi: existing.lokasi,
          jenis_sampah: existing.jenis_sampah ?? "",
          keterangan: existing.keterangan ?? "",
          status: existing.status,
        }
      : {
          kode_tempat_sampah: nextKode(),
          nama_tempat_sampah: "",
          lokasi: "",
          jenis_sampah: "",
          keterangan: "",
          status: "aktif",
        }
  );
  const [errors, setErrors] = useState({});

  // Jika data lama punya jenis di luar daftar, tetap ditampilkan agar tidak hilang
  const jenisOptions =
    existing?.jenis_sampah &&
    !JENIS_SAMPAH_OPTIONS.includes(existing.jenis_sampah)
      ? [...JENIS_SAMPAH_OPTIONS, existing.jenis_sampah]
      : JENIS_SAMPAH_OPTIONS;

  if (isEditing && !existing) {
    return (
      <main className="flex-1 px-5 sm:px-8 py-7 overflow-y-auto">
        <div className="rounded-[20px] bg-white border border-[#DDEFE3] p-8 shadow-sm max-w-xl">
          <h2 className="text-[20px] font-bold text-[#0F2E28]">
            Tempat sampah tidak ditemukan
          </h2>
          <p className="text-sm text-[#66756F] mt-2">
            Data dengan ID {id} tidak ada atau sudah dihapus.
          </p>
          <Link
            to="/kelola-sampah"
            className="inline-flex items-center gap-2 mt-5 rounded-full bg-[#0F5A38] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0B4A2E] transition"
          >
            <ArrowLeft size={16} />
            Kembali ke daftar tempat sampah
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
    const kode = form.kode_tempat_sampah.trim();
    if (!kode) er.kode_tempat_sampah = "Kode wajib diisi.";
    else if (isKodeTaken(kode, id))
      er.kode_tempat_sampah = "Kode sudah dipakai tempat sampah lain.";

    if (!form.nama_tempat_sampah.trim())
      er.nama_tempat_sampah = "Nama wajib diisi.";
    if (!form.lokasi.trim()) er.lokasi = "Lokasi wajib diisi.";
    if (!form.jenis_sampah.trim()) er.jenis_sampah = "Pilih jenis sampah.";
    return er;
  };

  const handleSubmit = () => {
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) return;

    const data = {
      kode_tempat_sampah: form.kode_tempat_sampah.trim(),
      nama_tempat_sampah: form.nama_tempat_sampah.trim(),
      lokasi: form.lokasi.trim(),
      jenis_sampah: form.jenis_sampah.trim(),
      keterangan: form.keterangan.trim(),
      status: form.status,
    };

    if (isEditing) {
      updateTempatSampah(id, data);
      navigate("/kelola-sampah", {
        state: { notice: "Data tempat sampah berhasil disimpan." },
      });
    } else {
      addTempatSampah(data);
      navigate("/kelola-sampah", {
        state: { notice: "Tempat sampah baru berhasil ditambahkan." },
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
          src={bannerSampah}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right-bottom"
        />
        <div className="relative h-full flex items-center gap-4 sm:gap-5 px-5 sm:px-7 py-5 sm:py-0">
          <div className="w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] shrink-0 rounded-full bg-white/60 flex items-center justify-center ring-4 ring-white/50">
            <div className="w-[48px] h-[48px] sm:w-[58px] sm:h-[58px] rounded-full bg-gradient-to-br from-[#2DB870] to-[#1B7A4A] flex items-center justify-center text-white shadow-md">
              {isEditing ? <Pencil size={24} /> : <Trash2 size={26} />}
            </div>
          </div>

          <div>
            <Link
              to="/kelola-sampah"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B7A4A] hover:underline"
            >
              <ArrowLeft size={15} />
              Kembali ke daftar tempat sampah
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-[24px] sm:text-[28px] font-extrabold tracking-[-0.5px] text-[#0F2E28]">
                {isEditing ? "Ubah Tempat Sampah" : "Tambah Tempat Sampah"}
              </h2>
              <Leaf size={22} className="text-[#3DBE72]" />
            </div>
            <p className="text-sm sm:text-[15px] text-[#0F2E28]/75 mt-0.5">
              {isEditing
                ? `Perbarui data ${existing.kode_tempat_sampah}.`
                : "Daftarkan tempat sampah baru agar bisa dipantau oleh sensor."}
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
            Data Tempat Sampah
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <Field
            label="Kode tempat sampah"
            icon={Hash}
            error={errors.kode_tempat_sampah}
            hint="Sudah diisi otomatis, boleh diubah."
          >
            <input
              name="kode_tempat_sampah"
              value={form.kode_tempat_sampah}
              onChange={handleChange}
              placeholder="TS-001"
              className={`${inputBase} pl-11 pr-3.5 ${borderFor("kode_tempat_sampah")}`}
            />
          </Field>

          <Field
            label="Jenis sampah"
            icon={Recycle}
            error={errors.jenis_sampah}
            hint="Pilih jenis sampah yang ditampung."
          >
            <select
              name="jenis_sampah"
              value={form.jenis_sampah}
              onChange={handleChange}
              className={`${inputBase} appearance-none pl-11 pr-10 cursor-pointer ${borderFor("jenis_sampah")} ${
                form.jenis_sampah ? "" : "text-[#9AA3AE]"
              }`}
            >
              <option value="" disabled>
                Pilih jenis sampah
              </option>
              {jenisOptions.map((j) => (
                <option key={j} value={j} className="text-[#14201B]">
                  {j}
                </option>
              ))}
            </select>
            <ChevronDown
              size={17}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#41504A] pointer-events-none"
            />
          </Field>

          <div className="sm:col-span-2">
            <Field
              label="Nama tempat sampah"
              icon={Tag}
              error={errors.nama_tempat_sampah}
              hint="Nama yang mudah dikenali, misalnya untuk ditampilkan di dashboard."
            >
              <input
                name="nama_tempat_sampah"
                value={form.nama_tempat_sampah}
                onChange={handleChange}
                placeholder="Contoh: Tempat Sampah Taman Utara"
                className={`${inputBase} pl-11 pr-3.5 ${borderFor("nama_tempat_sampah")}`}
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Lokasi" icon={MapPin} error={errors.lokasi}>
              <input
                name="lokasi"
                value={form.lokasi}
                onChange={handleChange}
                placeholder="Contoh: Taman Kota"
                className={`${inputBase} pl-11 pr-3.5 ${borderFor("lokasi")}`}
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field
              label="Keterangan"
              error={errors.keterangan}
              hint="Opsional. Catatan tambahan tentang tempat sampah ini."
            >
              <textarea
                name="keterangan"
                rows={3}
                value={form.keterangan}
                onChange={handleChange}
                placeholder="Contoh: Dekat pintu masuk sebelah timur"
                className={`${inputBase} px-3.5 resize-y ${borderFor("keterangan")}`}
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <span className="block text-[13px] font-semibold text-[#41504A] mb-1.5">
              Status
            </span>
            <div className="grid grid-cols-2 gap-2 sm:max-w-sm">
              {STATUS_OPTIONS.map((s) => {
                const active = form.status === s;
                const isAktif = s === "aktif";
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, status: s }))}
                    aria-pressed={active}
                    className={`inline-flex items-center justify-center gap-2 rounded-[12px] border py-2.5 text-sm font-semibold capitalize transition ${
                      active
                        ? isAktif
                          ? "border-[#1E9E63] bg-[#E4F5EC] text-[#1B7A4A]"
                          : "border-[#9AA3AE] bg-[#E4E7EB] text-[#41504A]"
                        : "border-[#DDEFE3] bg-white text-[#8B968F] hover:bg-[#F7FCF9]"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        active
                          ? isAktif
                            ? "bg-[#1E9E63]"
                            : "bg-[#5B6472]"
                          : "bg-[#C9D2CD]"
                      }`}
                    />
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* AKSI */}
        <div className="flex items-center justify-end gap-3 mt-7 pt-5 border-t border-[#E8F0EB]">
          <Link
            to="/kelola-sampah"
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
            {isEditing ? "Simpan perubahan" : "Tambah tempat sampah"}
          </button>
        </div>
      </section>
    </main>
  );
}