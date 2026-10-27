// Penyimpanan sederhana berbasis localStorage. Field mengikuti tabel
// `tempat_sampah`. Field level_sampah, berat_sampah, dan waktu_data berasal dari
// tabel `sensor_data` (data terbaru per tempat sampah) dan hanya dibaca,
// tidak diisi lewat form. Ganti isi fungsi dengan pemanggilan API nanti.

const KEY = "tempat_sampah";

// Sesuaikan dengan nilai enum `status` di database kamu.
export const STATUS_OPTIONS = ["aktif", "nonaktif"];

const SEED = [
  { id: 1, kode_tempat_sampah: "TS-001", lokasi: "Halaman Kantor", kapasitas: 120, status: "aktif", level_sampah: 42, berat_sampah: 18.5, waktu_data: "2025-09-15T07:30:00.000Z", created_at: "2025-08-01T08:00:00.000Z", updated_at: "2025-09-15T07:30:00.000Z" },
  { id: 2, kode_tempat_sampah: "TS-002", lokasi: "Taman Kota", kapasitas: 120, status: "aktif", level_sampah: 78, berat_sampah: 31.2, waktu_data: "2025-09-15T07:32:00.000Z", created_at: "2025-08-02T08:00:00.000Z", updated_at: "2025-09-15T07:32:00.000Z" },
  { id: 3, kode_tempat_sampah: "TS-003", lokasi: "Pasar Tradisional", kapasitas: 240, status: "aktif", level_sampah: 95, berat_sampah: 88.4, waktu_data: "2025-09-15T07:35:00.000Z", created_at: "2025-08-03T08:00:00.000Z", updated_at: "2025-09-15T07:35:00.000Z" },
  { id: 4, kode_tempat_sampah: "TS-004", lokasi: "Terminal", kapasitas: 240, status: "aktif", level_sampah: 23, berat_sampah: 12.0, waktu_data: "2025-09-15T07:36:00.000Z", created_at: "2025-08-04T08:00:00.000Z", updated_at: "2025-09-15T07:36:00.000Z" },
  { id: 5, kode_tempat_sampah: "TS-005", lokasi: "Sekolah", kapasitas: 120, status: "nonaktif", level_sampah: null, berat_sampah: null, waktu_data: null, created_at: "2025-08-05T08:00:00.000Z", updated_at: "2025-08-05T08:00:00.000Z" },
];

// Kondisi diturunkan dari level_sampah (persen). Ubah batasnya sesuai kebutuhan.
export const BATAS_HAMPIR_PENUH = 70;
export const BATAS_PENUH = 90;

export function getKondisi(t) {
  if (t.status === "nonaktif" || t.level_sampah == null) return "Tidak Aktif";
  if (t.level_sampah >= BATAS_PENUH) return "Penuh";
  if (t.level_sampah >= BATAS_HAMPIR_PENUH) return "Hampir Penuh";
  return "Normal";
}

export function getTempatSampah() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* abaikan, pakai data awal */
  }
  return SEED;
}

function saveTempatSampah(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* abaikan jika storage tidak tersedia */
  }
}

export function getTempatSampahById(id) {
  return getTempatSampah().find((t) => String(t.id) === String(id)) || null;
}

export function isKodeTaken(kode, exceptId = null) {
  const k = kode.trim().toLowerCase();
  return getTempatSampah().some(
    (t) =>
      t.kode_tempat_sampah.toLowerCase() === k && String(t.id) !== String(exceptId)
  );
}

// Saran kode berikutnya, misalnya TS-006
export function nextKode() {
  const nums = getTempatSampah()
    .map((t) => parseInt(String(t.kode_tempat_sampah).split("-")[1], 10))
    .filter((n) => !Number.isNaN(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `TS-${String(next).padStart(3, "0")}`;
}

export function addTempatSampah(data) {
  const list = getTempatSampah();
  const id = list.length ? Math.max(...list.map((t) => t.id)) + 1 : 1;
  const now = new Date().toISOString();
  saveTempatSampah([
    ...list,
    {
      id,
      ...data,
      level_sampah: null,
      berat_sampah: null,
      waktu_data: null,
      created_at: now,
      updated_at: now,
    },
  ]);
  return id;
}

export function updateTempatSampah(id, data) {
  saveTempatSampah(
    getTempatSampah().map((t) =>
      String(t.id) === String(id)
        ? { ...t, ...data, updated_at: new Date().toISOString() }
        : t
    )
  );
}

export function deleteTempatSampah(id) {
  saveTempatSampah(getTempatSampah().filter((t) => String(t.id) !== String(id)));
}