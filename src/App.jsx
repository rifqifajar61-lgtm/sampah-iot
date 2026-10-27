import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import LoginIoT from "./auth/login";
import Layout from "./Layout";
import Dashboard from "./pages/dashboard";
import KelolaPetugas from "./kelola petugas";
import CreatePetugas from "./kelola petugas/create";
import KelolaSampah from "./kelola sampah";
import CreateSampah from "./kelola sampah/create";
import Penugasan from "./penugasan";
import CreatePenugasan from "./penugasan/create";

function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();

  async function handleLogin({ username, password }) {
    // Sementara: anggap semua login berhasil.
    setIsLoggedIn(true);
    navigate("/dashboard");
  }

  return <LoginIoT onLogin={handleLogin} />;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />

        {/* Semua halaman di bawah ini otomatis pakai sidebar + topbar dari Layout */}
        <Route
          element={isLoggedIn ? <Layout /> : <Navigate to="/login" replace />}
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/kelola-petugas" element={<KelolaPetugas />} />
          <Route path="/kelola-petugas/tambah" element={<CreatePetugas />} />
          <Route path="/kelola-petugas/ubah/:id" element={<CreatePetugas />} />

          <Route path="/kelola-sampah" element={<KelolaSampah />} />
          <Route path="/kelola-sampah/tambah" element={<CreateSampah />} />
          <Route path="/kelola-sampah/ubah/:id" element={<CreateSampah />} />

          <Route path="/penugasan" element={<Penugasan />} />
          <Route path="/penugasan/tambah" element={<CreatePenugasan />} />
          <Route path="/penugasan/ubah/:id" element={<CreatePenugasan />} />
        </Route>

        {/* fallback: path lain diarahkan ke login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}