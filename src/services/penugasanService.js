// Penyimpanan sementara di localStorage. Ganti isi fungsi-fungsi ini dengan
// panggilan API saat backend sudah siap; nama dan bentuk datanya bisa tetap.

const KEY = "penugasan";

export const STATUS_OPTIONS = ["belum_mulai", "berjalan", "selesai"];

export const STATUS_LABEL = {
  belum_mulai: "Belum Mulai",
  berjalan: "Berjalan",
  selesai: "Selesai",
};

export const SHIFT_OPTIONS = ["07:00 - 15:00", "15:00 - 23:00", "23:00 - 07:00"];

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // abaikan jika penyimpanan penuh / diblokir
  }
}

function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2, 6);
}

// Terbaru di atas
export function getPenugasan() {
  return read().sort((a, b) => (b.tanggal || "").localeCompare(a.tanggal || ""));
}

export function getPenugasanById(id) {
  return read().find((p) => String(p.id) === String(id)) || null;
}

export function addPenugasan(data) {
  const item = { ...data, id: newId() };
  write([...read(), item]);
  return item;
}

export function updatePenugasan(id, data) {
  write(
    read().map((p) => (String(p.id) === String(id) ? { ...p, ...data, id: p.id } : p))
  );
}

export function deletePenugasan(id) {
  write(read().filter((p) => String(p.id) !== String(id)));
}

// Petugas yang sama tidak boleh punya dua tugas di tanggal + shift yang sama.
export function isJadwalBentrok({ petugas_id, tanggal, shift }, excludeId) {
  return read().some(
    (p) =>
      String(p.id) !== String(excludeId ?? "") &&
      String(p.petugas_id) === String(petugas_id) &&
      p.tanggal === tanggal &&
      p.shift === shift
  );
}