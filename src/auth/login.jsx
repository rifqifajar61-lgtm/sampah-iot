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
        await onLogin({
          username,
          password,
        });
      }
    } catch (err) {
      setError(err?.message || "Username atau password salah.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#EDF3F4] p-4 sm:p-6 lg:p-8 flex items-center justify-center font-sans">

      {/* ================= FRAME ================= */}
      <div className="relative w-full max-w-[1500px] min-h-[700px] lg:h-[calc(100vh-64px)] lg:min-h-[680px] overflow-hidden rounded-[24px] bg-white shadow-[0_25px_70px_rgba(28,80,78,0.15)] flex flex-col lg:flex-row">


        {/* =====================================================
            LEFT — VISUAL SMART BIN
        ===================================================== */}
        <section className="relative w-full lg:w-[55%] overflow-hidden bg-[#eaf8ee] min-h-[500px] lg:min-h-0">

          {/* blob kiri atas */}
          <div className="absolute -top-32 -left-28 w-[360px] h-[330px] rounded-full bg-[#15897c]" />

          <div className="absolute -top-20 left-[90px] w-[210px] h-[220px] rounded-full bg-[#89d795] opacity-60" />


          {/* blob kiri bawah */}
          <div className="absolute bottom-0 left-0 w-full h-[45%]">
            <img
              src={waveImg}
              alt=""
              className="w-full h-full object-cover object-bottom"
            />
          </div>


          {/* lingkaran dekorasi belakang tong */}
          <div className="absolute left-[10%] bottom-[14%] w-[390px] h-[390px] rounded-full bg-[#c2ebd2] opacity-80" />

          <div className="absolute left-[21%] bottom-[8%] w-[500px] h-[110px] rounded-[50%] bg-[#acdfbb] opacity-80" />


          {/* ================= PARTIKEL DAUN ================= */}

<img
  src={singleLeafImg}
  alt=""
  className="absolute z-10 top-[30%] right-[12%] w-[90px] -rotate-[15deg] opacity-85"
/>

<img
  src={singleLeafImg}
  alt=""
  className="absolute z-10 top-[45%] left-[6%] w-[100px] rotate-[60deg] opacity-85"
/>

<img
  src={singleLeafImg}
  alt=""
  className="absolute z-10 bottom-[35%] right-[8%] w-[80px] -rotate-[40deg] opacity-75"
/>

<img
  src={singleLeafImg}
  alt=""
  className="absolute z-10 bottom-[20%] left-[8%] w-[95px] rotate-[10deg] opacity-85"
/>


          {/* ================= BRAND ================= */}
          <div className="relative z-20 flex items-center justify-center gap-4 pt-10 sm:pt-12 lg:pt-[11%]">

            <div className="w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] flex items-center justify-center">

              <img
                src={trashIcon}
                alt="Smart Bin Logo"
                className="w-full h-full object-contain"
              />

            </div>


            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] leading-none font-black tracking-[-1.5px] text-[#123D4A]">
                Smart Trash <span className="text-[#169962]">Bin</span>
              </h1>

              <p className="mt-2 text-sm sm:text-base lg:text-[18px] font-medium text-[#60788E]">
                Sistem Monitoring Tempat Sampah Pintar
              </p>

              <p className="mt-0.5 text-base sm:text-lg leading-[1.7] font-medium text-[#526F84]">
                Bersama menjaga lingkungan dengan teknologi yang lebih baik.
              </p>
            </div>

          </div>


          {/* ================= FOTO TONG ================= */}
          <div className="absolute z-10 bottom-[8%] left-[50%] -translate-x-[48%] w-[78%] lg:w-[72%] max-w-[570px]">

            <img
              src={sampahImg}
              alt="Smart Bin"
              className="w-full h-auto object-contain drop-shadow-[0_25px_25px_rgba(30,80,80,0.16)]"
            />

          </div>


          {/* ================= GARIS DEKORASI ================= */}
          <div className="absolute z-20 right-[22%] bottom-[55%] rotate-[45deg] flex items-end gap-2">

            <span className="block w-[8px] h-[38px] rounded-full bg-[#168B88] -rotate-[40deg] origin-bottom" />

            <span className="block w-[9px] h-[38px] rounded-full bg-[#168B88] origin-bottom -translate-y-1" />

            <span className="block w-[8px] h-[38px] rounded-full bg-[#168B88] rotate-[40deg] origin-bottom" />

          </div>
        </section>


        {/* =====================================================
            RIGHT — LOGIN
        ===================================================== */}
        <section className="relative flex-1 bg-white overflow-hidden">


          {/* dekorasi kanan bawah */}
         <div className="absolute -bottom-24 -right-4 w-[220px] sm:w-[260px]">
  <img
    src={sampahKotorImg}
    alt="Tumpukan Sampah"
    className="w-full h-auto object-contain"
  />
</div>


         {/* ================= KELOMPOK DAUN (KANAN) ================= */}
<div className="absolute z-0 top-4 right-4 w-[150px]">
  <img
    src={leafImg}
    alt=""
    className="w-full h-auto object-contain"
  />
</div>


          {/* ================= LOGIN CONTENT ================= */}
          <div className="relative z-10 min-h-full flex items-center justify-center px-7 py-14 sm:px-12 lg:px-[11%]">

            <div className="w-full max-w-[520px]">


              {/* icon user */}
              <div className="mb-5 flex items-center justify-center w-[76px] h-[76px] rounded-full bg-[#E7F5F4] text-[#168C89] mx-auto">

  <User
    size={40}
    strokeWidth={2.2}
  />

</div>


{/* heading */}
<h2 className="text-4xl sm:text-[42px] leading-tight font-extrabold tracking-[-1.5px] text-[#10254A] text-center">
  Login Admin
</h2>

<p className="mt-4 text-base sm:text-[17px] leading-[1.65] font-medium text-[#687F97] text-center">
  Masuk ke sistem untuk mengelola data
  <br className="hidden sm:block" />
  tempat sampah pintar.
</p>


              {/* ================= FORM ================= */}
              <form
                onSubmit={handleSubmit}
                className="mt-10"
              >


                {/* EMAIL / USERNAME */}
                <div className="mb-6">

                  <label className="block mb-2.5 text-base font-bold text-[#14294A]">
                    Username
                  </label>

                  <div className="relative flex items-center">

                    <User
                      size={24}
                      strokeWidth={2}
                      className="absolute left-5 text-[#637B95] pointer-events-none"
                    />

                    <input
                      type="text"
                      placeholder="Masukkan username anda"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (error) setError("");
                      }}
                      className="w-full h-[58px] rounded-[10px] border-[1.5px] border-[#CDD9E4] bg-white pl-[62px] pr-5 text-base text-[#21344D] outline-none transition placeholder:text-[#91A4BA] focus:border-[#1B918D] focus:ring-4 focus:ring-[#1B918D]/10"
                    />

                  </div>

                </div>


                {/* PASSWORD */}
                <div className="mb-6">

                  <label className="block mb-2.5 text-base font-bold text-[#14294A]">
                    Password
                  </label>

                  <div className="relative flex items-center">

                    <Lock
                      size={24}
                      strokeWidth={2}
                      className="absolute left-5 text-[#637B95] pointer-events-none"
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Masukkan password anda"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      className="w-full h-[58px] rounded-[10px] border-[1.5px] border-[#CDD9E4] bg-white pl-[62px] pr-[58px] text-base text-[#21344D] outline-none transition placeholder:text-[#91A4BA] focus:border-[#1B918D] focus:ring-4 focus:ring-[#1B918D]/10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-strong-password-auto-fill-button]:hidden"
                    />


                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((s) => !s)
                      }
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                      className="absolute right-4 text-[#637B95] hover:text-[#168C89] transition"
                    >

                      {showPassword ? (
                        <EyeOff
                          size={23}
                          strokeWidth={2}
                        />
                      ) : (
                        <Eye
                          size={23}
                          strokeWidth={2}
                        />
                      )}

                    </button>

                  </div>

                </div>


                {/* ERROR */}
                {error && (
                  <p className="mb-4 text-sm font-medium text-[#C24E46]">
                    {error}
                  </p>
                )}


                {/* ================= LOGIN BUTTON ================= */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[62px] rounded-[10px] bg-[#168B88] hover:bg-[#117976] text-white flex items-center justify-center gap-3 text-[18px] font-bold transition-all duration-200 hover:shadow-[0_10px_25px_rgba(22,139,136,0.2)] active:translate-y-[1px] disabled:opacity-70 disabled:cursor-not-allowed"
                >

                  {loading ? (
                    "Memproses..."
                  ) : (
                    <>
                      <LogIn
                        size={25}
                        strokeWidth={2.2}
                      />

                      Login
                    </>
                  )}

                </button>

              </form>


              {/* ================= FOOTER ================= */}
              <p className="mt-14 text-center text-sm text-[#667D97]">
                © 2026 Smart Bin. All rights reserved.
              </p>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}