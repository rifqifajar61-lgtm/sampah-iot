import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  UserPlus,
  Pencil,
  Save,
  X,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  Contact,
  Lock,
  Leaf,
  IdCard,
  KeyRound,
} from "lucide-react";
import {
  STATUS_OPTIONS,
  addPetugas,
  updatePetugas,
  getPetugasById,
  isUsernameTaken,
} from "../services/petugasService";
// Banner yang sama dengan halaman Kelola Petugas
import bannerPetugas from "../assets/petugas.png";

const EMPTY_FORM = {
  nama: "",
  username: "",
  no_hp: "",
  alamat: "",
  status: "aktif",
  password: "",
};

const inputBase =
  "w-full rounded-[12px] border bg-white py-3 text-sm text-[#14201B] placeholder:text-[#9AA3AE] outline-none transition focus:border-[#1E9E63] focus:ring-2 focus:ring-[#1E9E63]/20";

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

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-9 h-9 rounded-[12px] bg-[#E4F5EC] flex items-center justify-center">
        <Icon size={18} className="text-[#1B7A4A]" />
      </div>
      <h3 className="text-[16px] font-bold text-[#0F2E28]">{children}</h3>
    </div>
  );
}

// Dipakai untuk dua route:
//   /kelola-petugas/tambah      -> tambah petugas baru
//   /kelola-petugas/ubah/:id    -> ubah petugas yang sudah ada
export default function CreatePetugas() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const existing = isEditing ? getPetugasById(id) : null;

  const [form, setForm] = useState(() =>
    existing
      ? {
          nama: existing.nama,
          username: existing.username,
          no_hp: existing.no_hp,
          alamat: existing.alamat,
          status: existing.status,
          password: "",
        }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  if (isEditing && !existing) {
    return (
      <main className="flex-1 px-5 sm:px-8 py-7 overflow-y-auto">
        <div className="rounded-[20px] bg-white border border-[#DDEFE3] p-8 shadow-sm max-w-xl">
          <h2 className="text-[20px] font-bold text-[#0F2E28]">
            Petugas tidak ditemukan
          </h2>
          <p className="text-sm text-[#66756F] mt-2">
            Data dengan ID {id} tidak ada atau sudah dihapus.
          </p>
          <Link
            to="/kelola-petugas"
            className="inline-flex items-center gap-2 mt-5 rounded-full bg-[#0F5A38] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0B4A2E] transition"
          >
            <ArrowLeft size={16} />
            Kembali ke daftar petugas
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
    if (!form.nama.trim()) er.nama = "Nama lengkap wajib diisi.";

    if (!form.username.trim()) er.username = "Username wajib diisi.";
    else if (!/^[a-zA-Z0-9._]{4,}$/.test(form.username.trim()))
      er.username = "Minimal 4 karakter: huruf, angka, titik, atau garis bawah.";
    else if (isUsernameTaken(form.username, id))
      er.username = "Username sudah dipakai petugas lain.";

    if (!form.no_hp.trim()) er.no_hp = "Nomor HP wajib diisi.";
    else if (!/^[0-9+]{9,15}$/.test(form.no_hp)) er.no_hp = "Gunakan 9-15 digit angka.";

    if (!form.alamat.trim()) er.alamat = "Alamat wajib diisi.";

    if (!isEditing && form.password.length < 6)
      er.password = "Password minimal 6 karakter.";
    if (isEditing && form.password && form.password.length < 6)
      er.password = "Password baru minimal 6 karakter.";
    return er;
  };

  const handleSubmit = () => {
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length > 0) return;

    // Password tidak disimpan di localStorage. Kirim ke API saat backend siap
    // (di-hash di server). Saat ubah, kosong berarti password tidak diganti.
    // eslint-disable-next-line no-unused-vars
    const { password, ...data } = form;
    data.nama = data.nama.trim();
    data.username = data.username.trim();
    data.alamat = data.alamat.trim();

    if (isEditing) {
      updatePetugas(id, data);
      navigate("/kelola-petugas", {
        state: { notice: "Data petugas berhasil disimpan." },
      });
    } else {
      addPetugas(data);
      navigate("/kelola-petugas", {
        state: { notice: "Petugas baru berhasil ditambahkan." },
      });
    }
  };

  const borderFor = (name) =>
    errors[name] ? "border-[#D14B37]" : "border-[#DDEFE3]";

  return (
    <main className="flex-1 px-5 sm:px-8 py-6 overflow-y-auto">
      {/* BANNER */}
      <header className="relative overflow-hidden rounded-[20px] border border-white/60 shadow-sm bg-[#E4F5EC] mb-5 min-h-[150px] sm:h-[170px]">
        <img
          src={bannerPetugas}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="relative h-full flex items-center gap-4 sm:gap-5 px-5 sm:px-7 py-5 sm:py-0">
          <div className="w-[64px] h-[64px] sm:w-[76px] sm:h-[76px] shrink-0 rounded-full bg-white/60 flex items-center justify-center ring-4 ring-white/50">
            <div className="w-[48px] h-[48px] sm:w-[58px] sm:h-[58px] rounded-full bg-gradient-to-br from-[#2DB870] to-[#1B7A4A] flex items-center justify-center text-white shadow-md">
              {isEditing ? <Pencil size={24} /> : <UserPlus size={26} />}
            </div>
          </div>

          <div>
            <Link
              to="/kelola-petugas"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1B7A4A] hover:underline"
            >
              <ArrowLeft size={15} />
              Kembali ke daftar petugas
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-[26px] sm:text-[30px] font-extrabold tracking-[-0.5px] text-[#0F2E28]">
                {isEditing ? "Ubah Petugas" : "Tambah Petugas"}
              </h2>
              <Leaf size={24} className="text-[#3DBE72]" />
            </div>
            <p className="text-sm sm:text-[15px] text-[#0F2E28]/75 mt-0.5">
              {isEditing
                ? `Perbarui data akun petugas ${existing.nama}.`
                : "Isi data diri dan akun login untuk petugas baru."}
            </p>
          </div>
        </div>
      </header>

      {/* FORM */}
      <section className="rounded-[20px] bg-white border border-[#DDEFE3] p-5 sm:p-7 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
          {/* DATA DIRI */}
          <div className="lg:pr-8 lg:border-r lg:border-[#E8F0EB]">
            <SectionTitle icon={IdCard}>Data Diri</SectionTitle>

            <div className="flex flex-col gap-4">
              <Field label="Nama lengkap" icon={User} error={errors.nama}>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Contoh: Andi Setiawan"
                  className={`${inputBase} pl-11 pr-3.5 ${borderFor("nama")}`}
                />
              </Field>

              <Field label="Nomor HP" icon={Phone} error={errors.no_hp}>
                <input
                  name="no_hp"
                  inputMode="tel"
                  value={form.no_hp}
                  onChange={handleChange}
                  placeholder="08xxxxxxxxxx"
                  className={`${inputBase} pl-11 pr-3.5 ${borderFor("no_hp")}`}
                />
              </Field>

              <Field label="Alamat" icon={MapPin} iconTop error={errors.alamat}>
                <textarea
                  name="alamat"
                  rows={3}
                  value={form.alamat}
                  onChange={handleChange}
                  placeholder="Alamat tempat tinggal petugas"
                  className={`${inputBase} resize-none pl-11 pr-3.5 ${borderFor("alamat")}`}
                />
              </Field>
            </div>
          </div>

          {/* AKUN LOGIN */}
          <div className="lg:pl-8">
            <SectionTitle icon={KeyRound}>Akun Login</SectionTitle>

            <div className="flex flex-col gap-4">
              <Field
                label="Username"
                icon={Contact}
                error={errors.username}
                hint="Dipakai petugas untuk login."
              >
                <input
                  name="username"
                  autoComplete="off"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="andi.setiawan"
                  className={`${inputBase} pl-11 pr-3.5 ${borderFor("username")}`}
                />
              </Field>

              <Field
                label={isEditing ? "Password baru" : "Password"}
                icon={Lock}
                error={errors.password}
                hint={
                  isEditing
                    ? "Kosongkan jika tidak ingin mengganti password."
                    : "Minimal 6 karakter."
                }
              >
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={isEditing ? "Tidak diubah" : "Minimal 6 karakter"}
                  className={`${inputBase} pl-11 pr-11 ${borderFor("password")}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B968F] hover:text-[#41504A]"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </Field>

              <div>
                <span className="block text-[13px] font-semibold text-[#41504A] mb-1.5">
                  Status
                </span>
                <div className="grid grid-cols-2 gap-2">
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
          </div>
        </div>

        {/* AKSI */}
        <div className="flex items-center justify-end gap-3 mt-7 pt-5 border-t border-[#E8F0EB]">
          <Link
            to="/kelola-petugas"
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
            {isEditing ? "Simpan perubahan" : "Tambah petugas"}
          </button>
        </div>
      </section>
    </main>
  );
}