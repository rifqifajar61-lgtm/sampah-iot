// Penyimpanan sederhana berbasis localStorage supaya index.jsx dan create.jsx
// berbagi data yang sama. Field mengikuti tabel `petugas` di database.
// Ganti isi fungsi-fungsi ini dengan pemanggilan API saat backend sudah siap.

const KEY = "petugas";

// Sesuaikan dengan nilai enum `status` di database kamu.
export const STATUS_OPTIONS = ["aktif", "nonaktif"];

const SEED = [
  { id: 1, admin_id: 1, username: "andi.setiawan", nama: "Andi Setiawan", no_hp: "081234567801", alamat: "Jl. Malioboro No. 12, Yogyakarta", status: "aktif", created_at: "2025-09-01T08:00:00.000Z" },
  { id: 2, admin_id: 1, username: "budi.santoso", nama: "Budi Santoso", no_hp: "081234567802", alamat: "Jl. Kaliurang Km 5, Sleman", status: "aktif", created_at: "2025-09-02T08:00:00.000Z" },
  { id: 3, admin_id: 1, username: "siti.nurhaliza", nama: "Siti Nurhaliza", no_hp: "081234567803", alamat: "Jl. Parangtritis Km 3, Bantul", status: "aktif", created_at: "2025-09-03T08:00:00.000Z" },
  { id: 4, admin_id: 1, username: "rudi.hartono", nama: "Rudi Hartono", no_hp: "081234567804", alamat: "Jl. Godean Km 7, Sleman", status: "nonaktif", created_at: "2025-09-04T08:00:00.000Z" },
];

export function getPetugas() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* abaikan, pakai data awal */
  }
  return SEED;
}

function savePetugas(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* abaikan jika storage tidak tersedia */
  }
}

export function getPetugasById(id) {
  return getPetugas().find((p) => String(p.id) === String(id)) || null;
}

export function isUsernameTaken(username, exceptId = null) {
  const u = username.trim().toLowerCase();
  return getPetugas().some(
    (p) => p.username.toLowerCase() === u && String(p.id) !== String(exceptId)
  );
}

// `password` sengaja tidak disimpan di sini. Kirim ke API (di-hash di server).
export function addPetugas(data) {
  const list = getPetugas();
  const id = list.length ? Math.max(...list.map((p) => p.id)) + 1 : 1;
  savePetugas([
    ...list,
    { id, admin_id: 1, ...data, created_at: new Date().toISOString() },
  ]);
  return id;
}

export function updatePetugas(id, data) {
  savePetugas(
    getPetugas().map((p) => (String(p.id) === String(id) ? { ...p, ...data } : p))
  );
}

export function deletePetugas(id) {
  savePetugas(getPetugas().filter((p) => String(p.id) !== String(id)));
}