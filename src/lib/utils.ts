import { isAllowedMediaUrl } from "@/lib/media-url";

type ClassValue = string | false | null | undefined;

/** Menggabungkan class name, mengabaikan nilai kosong. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function formatRupiah(amount: number): string {
  return rupiahFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  // Server Vercel memakai UTC; tanpa ini tanggal bisa mundur satu hari.
  timeZone: "Asia/Jakarta",
});

/** Mengubah string tanggal ISO menjadi "28 Oktober 2026". Mengembalikan "" jika tidak valid. */
export function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

/**
 * Gambar yang berasal dari aset lokal (`/public`), domain media R2 (`VITE_MEDIA_PUBLIC_DOMAIN`),
 * atau host Vercel Blob legacy selama masa transisi.
 */
export function isOptimizableImage(src: string): boolean {
  return isAllowedMediaUrl(src);
}
