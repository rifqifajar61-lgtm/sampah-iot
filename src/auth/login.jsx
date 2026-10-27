
import { useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
} from "lucide-react";

import sampahImg from "../assets/sampah.png";
import trashIcon from "../assets/logo.png";
import leafImg from "../assets/daun.png";
import waveImg from "../assets/background.png";
import sampahKotorImg from "../assets/hiasan.png";
import singleLeafImg from "../assets/tunggal.png";

export default function LoginIoT({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (onLogin) {
        await onLogin({ username, password });
      }
    } catch (err) {
      setError(err?.message || "Username atau password salah.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#EDF3F4] font-sans sm:p-4 lg:p-8">
      {/* FRAME UTAMA */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] flex-col overflow-hidden bg-white shadow-none sm:rounded-2xl sm:shadow-[0_25px_70px_rgba(28,80,78,0.15)] lg:min-h-0 lg:h-[calc(100vh-64px)] lg:flex-row lg:rounded-[24px]">

        {/* ================= ILUSTRASI ================= */}
        <section className="relative h-[220px] min-h-[220px] w-full shrink-0 overflow-hidden bg-[#eaf8ee] sm:h-[320px] sm:min-h-[320px] lg:h-auto lg:min-h-0 lg:w-[55%] lg:flex-1">

          {/* Dekorasi latar */}
          <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#15897c] sm:-left-28 sm:-top-32 sm:h-[330px] sm:w-[360px]" />

          <div className="absolute -top-12 left-16 h-40 w-40 rounded-full bg-[#89d795]/60 sm:-top-20 sm:left-[90px] sm:h-[220px] sm:w-[210px]" />

          <div className="absolute bottom-0 left-0 h-[45%] w-full">
            <img
              src={waveImg}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-bottom"
            />
          </div>

          <div className="absolute bottom-[8%] left-[10%] h-48 w-48 rounded-full bg-[#c2ebd2]/80 sm:bottom-[14%] sm:h-[390px] sm:w-[390px]" />

          <div className="absolute bottom-[8%] left-[21%] h-16 w-[75%] rounded-[50%] bg-[#acdfbb]/80 sm:bottom-[8%] sm:h-[110px] sm:w-[500px]" />

          {/* Daun dekorasi */}
          <img
            src={singleLeafImg}
            alt=""
            aria-hidden="true"
            className="absolute right-[8%] top-[30%] z-10 w-10 opacity-85 sm:right-[12%] sm:w-[90px]"
          />

          <img
            src={singleLeafImg}
            alt=""
            aria-hidden="true"
            className="absolute bottom-[22%] left-[5%] z-10 w-10 rotate-[60deg] opacity-85 sm:bottom-[35%] sm:left-[6%] sm:w-[100px]"
          />

          <img
            src={singleLeafImg}
            alt=""
            aria-hidden="true"
            className="absolute bottom-[20%] right-[8%] z-10 hidden w-[80px] opacity-75 sm:block"
          />

          <img
            src={singleLeafImg}
            alt=""
            aria-hidden="true"
            className="absolute bottom-[20%] left-[8%] z-10 hidden w-[95px] sm:block"
          />

          {/* BRAND */}
          <div className="relative z-20 flex items-center justify-center gap-2 px-3 pt-6 sm:gap-4 sm:pt-10 lg:gap-4 lg:pt-[11%]">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center sm:h-[90px] sm:w-[90px] lg:h-[110px] lg:w-[110px]">
              <img
                src={trashIcon}
                alt="Smart Bin Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-[25px] font-black leading-tight tracking-[-1px] text-[#123D4A] sm:text-4xl sm:tracking-[-1.5px] lg:text-[clamp(32px,3.4vw,54px)]">
                Smart Trash <span className="text-[#169962]">Bin</span>
              </h1>

              <p className="mt-1 hidden text-sm font-medium text-[#60788E] sm:block lg:text-base">
                Sistem Monitoring Tempat Sampah Pintar
              </p>

              <p className="mt-1 hidden text-sm font-medium leading-relaxed text-[#526F84] sm:block lg:text-lg">
                Bersama menjaga lingkungan dengan teknologi yang lebih baik.
              </p>
            </div>
          </div>

          
{/* Gambar tong: tampil di HP dan desktop */}
<div className="absolute bottom-[2%] left-1/2 z-10 block w-[65%] max-w-[570px] -translate-x-1/2 sm:bottom-[5%] sm:w-[48%] lg:bottom-[8%] lg:w-[72%]">
  <img
    src={sampahImg}
    alt="Smart Bin"
    className="h-auto w-full object-contain drop-shadow-[0_25px_25px_rgba(30,80,80,0.16)]"
  />
</div>


          {/* Garis dekorasi */}
          <div className="absolute bottom-[30%] right-[20%] z-20 flex rotate-[45deg] items-end gap-1 sm:bottom-[55%] sm:right-[22%] sm:gap-2">
            <span className="block h-5 w-1.5 -rotate-[40deg] rounded-full bg-[#168B88] sm:h-[38px] sm:w-2" />
            <span className="block h-5 w-1.5 rounded-full bg-[#168B88] sm:h-[38px] sm:w-[9px]" />
            <span className="block h-5 w-1.5 rotate-[40deg] rounded-full bg-[#168B88] sm:h-[38px] sm:w-2" />
          </div>
        </section>

        {/* ================= LOGIN ================= */}
        <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-white lg:min-w-[420px] lg:flex-[0_0_45%]">

          {/* Dekorasi kanan atas */}
          <div className="pointer-events-none absolute right-2 top-2 z-0 w-16 opacity-80 sm:right-4 sm:top-4 sm:w-[120px] lg:w-[150px]">
            <img
              src={leafImg}
              alt=""
              aria-hidden="true"
              className="h-auto w-full object-contain"
            />
          </div>

          {/* Dekorasi kanan bawah */}
          <div className="pointer-events-none absolute -bottom-12 -right-4 z-0 w-28 opacity-80 sm:-bottom-16 sm:w-[200px] lg:-bottom-24 lg:w-[260px]">
            <img
              src={sampahKotorImg}
              alt=""
              aria-hidden="true"
              className="h-auto w-full object-contain"
            />
          </div>

          {/* Konten login */}
          <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:overflow-y-auto lg:px-[9%] lg:py-10 xl:px-[11%]">

            <div className="w-full max-w-[520px]">

              {/* Ikon admin */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7F5F4] text-[#168C89] sm:mb-5 sm:h-[76px] sm:w-[76px]">
                <User
                  size={32}
                  strokeWidth={2.2}
                  className="sm:hidden"
                />
                <User
                  size={40}
                  strokeWidth={2.2}
                  className="hidden sm:block"
                />
              </div>

              {/* Judul */}
              <h2 className="text-center text-[30px] font-extrabold leading-tight tracking-[-1px] text-[#10254A] sm:text-[38px] sm:tracking-[-1.5px] lg:text-[42px]">
                Login Admin
              </h2>

              <p className="mt-3 text-center text-sm font-medium leading-relaxed text-[#687F97] sm:mt-4 sm:text-base lg:text-[17px]">
                Masuk ke sistem untuk mengelola data
                <br className="hidden sm:block" />
                {" "}tempat sampah pintar.
              </p>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="mt-7 sm:mt-10">

                {/* USERNAME */}
                <div className="mb-5 sm:mb-6">
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-bold text-[#14294A] sm:mb-2.5 sm:text-base"
                  >
                    Username
                  </label>

                  <div className="relative flex items-center">
                    <User
                      size={21}
                      strokeWidth={2}
                      className="pointer-events-none absolute left-4 text-[#637B95] sm:left-5 sm:h-6 sm:w-6"
                    />

                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Masukkan username anda"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (error) setError("");
                      }}
                      className="h-[52px] w-full rounded-[10px] border-[1.5px] border-[#CDD9E4] bg-white pl-12 pr-3 text-sm text-[#21344D] outline-none transition placeholder:text-xs placeholder:text-[#91A4BA] focus:border-[#1B918D] focus:ring-4 focus:ring-[#1B918D]/10 sm:h-[58px] sm:pl-[62px] sm:pr-5 sm:text-base sm:placeholder:text-sm"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="mb-5 sm:mb-6">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-bold text-[#14294A] sm:mb-2.5 sm:text-base"
                  >
                    Password
                  </label>

                  <div className="relative flex items-center">
                    <Lock
                      size={21}
                      strokeWidth={2}
                      className="pointer-events-none absolute left-4 text-[#637B95] sm:left-5 sm:h-6 sm:w-6"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password anda"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      className="h-[52px] w-full rounded-[10px] border-[1.5px] border-[#CDD9E4] bg-white pl-12 pr-12 text-sm text-[#21344D] outline-none transition placeholder:text-xs placeholder:text-[#91A4BA] focus:border-[#1B918D] focus:ring-4 focus:ring-[#1B918D]/10 sm:h-[58px] sm:pl-[62px] sm:pr-[58px] sm:text-base sm:placeholder:text-sm"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                      className="absolute right-3 flex min-h-10 min-w-10 items-center justify-center text-[#637B95] transition hover:text-[#168C89] sm:right-4"
                    >
                      {showPassword ? (
                        <EyeOff size={21} className="sm:h-[23px] sm:w-[23px]" />
                      ) : (
                        <Eye size={21} className="sm:h-[23px] sm:w-[23px]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* PESAN ERROR */}
                {error && (
                  <p
                    role="alert"
                    className="mb-4 break-words text-sm font-medium text-[#C24E46]"
                  >
                    {error}
                  </p>
                )}

                {/* TOMBOL LOGIN */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-[54px] w-full items-center justify-center gap-3 rounded-[10px] bg-[#168B88] text-base font-bold text-white transition-all duration-200 hover:bg-[#117976] hover:shadow-[0_10px_25px_rgba(22,139,136,0.2)] active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70 sm:h-[62px] sm:text-lg"
                >
                  {loading ? (
                    "Memproses..."
                  ) : (
                    <>
                      <LogIn size={22} strokeWidth={2.2} />
                      Login
                    </>
                  )}
                </button>
              </form>

              {/* FOOTER */}
              <p className="mt-8 pb-2 text-center text-xs text-[#667D97] sm:mt-14 sm:text-sm">
                © 2026 Smart Bin. All rights reserved.
              </p>

            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
