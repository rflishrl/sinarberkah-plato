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
});

/** Mengubah string tanggal ISO menjadi "28 Oktober 2026". Mengembalikan "" jika tidak valid. */
export function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
}

/**
 * Gambar yang boleh dioptimasi Next.js: gambar lokal (/public) dan gambar di Vercel Blob
 * (host-nya terdaftar di images.remotePatterns pada next.config.ts).
 */
export function isOptimizableImage(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    return new URL(src).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}
