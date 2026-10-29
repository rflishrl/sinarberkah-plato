import "server-only";

import { z } from "zod";

import {
  articleSchema,
  galleryItemSchema,
  productSchema,
  type Article,
  type GalleryItem,
  type PortfolioItem,
  type Product,
} from "@/types/api";

/*
 * Klien API backend (C:\Projects\sinarberkah-backend). Hanya dipakai di server.
 *
 * Aturan yang dipegang file ini:
 * - Respons diperiksa bentuknya dengan Zod. Item yang rusak dibuang dan dicatat di log.
 * - Gagal dimuat (jaringan, timeout, 5xx) dicoba ulang sekali, lalu melempar `ApiError`.
 *   Halaman statis yang gagal dibuat ulang (revalidate) tetap menampilkan versi terakhir yang baik,
 *   jadi gangguan sesaat tidak tersimpan sebagai halaman kosong atau data cadangan.
 * - "Belum ada data" (`[]`) berbeda dengan "gagal dimuat" (melempar error).
 * - Setiap permintaan diberi tag cache. Backend memanggil `/api/revalidate` setelah admin
 *   menyimpan data, jadi perubahan tampil langsung. `REVALIDATE_SECONDS` hanya jaring pengaman.
 */

/**
 * Alamat backend. Di produksi wajib diisi, supaya salah konfigurasi langsung terlihat
 * (build gagal dengan pesan jelas) dan tidak diam-diam memakai alamat lain.
 * Saat pengembangan, bawaannya backend lokal supaya tidak tak sengaja memakai data produksi.
 */
export function getApiBaseUrl(): string {
  const configured = process.env.API_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") {
    throw new ApiError(
      "API_BASE_URL belum diisi. Variabel ini wajib di produksi.",
    );
  }
  return "http://localhost:4000";
}

export const CACHE_TAGS = {
  portfolio: "portfolio",
  gallery: "gallery",
  products: "products",
  articles: "articles",
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

const REVALIDATE_SECONDS = 60 * 60;
const REQUEST_TIMEOUT_MS = 6_000;
const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 500;
/** Batas maksimum per halaman yang diterima backend. Tanpa ini backend hanya mengirim 50 item. */
const LIST_LIMIT = 100;
/** Pengaman agar daftar yang sangat besar tidak membuat render menunggu terlalu lama. */
const MAX_PAGES = 10;

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

/** Kesalahan yang tidak berguna jika diulang (mis. 404 atau 400). */
class PermanentError extends ApiError {}

const envelopeSchema = z.object({
  data: z.array(z.unknown()),
  meta: z.object({ totalPages: z.number().int().nonnegative() }).optional(),
});

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function requestJson(path: string, tag: CacheTag): Promise<unknown> {
  const baseUrl = getApiBaseUrl();
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        next: { revalidate: REVALIDATE_SECONDS, tags: [tag] },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (response.ok) return await response.json();

      const message = `HTTP ${response.status}`;
      // 4xx (selain 429) tidak akan berubah jika diulang.
      if (response.status < 500 && response.status !== 429) {
        throw new PermanentError(message);
      }
      lastError = new ApiError(message);
    } catch (error) {
      if (error instanceof PermanentError) throw error;
      lastError = error;
    }

    if (attempt < MAX_ATTEMPTS) await wait(RETRY_DELAY_MS);
  }

  const reason =
    lastError instanceof Error ? lastError.message : String(lastError);
  throw new ApiError(`Gagal memuat ${path}: ${reason}`);
}

/**
 * Mengambil semua halaman sebuah daftar (100 item per halaman) sampai `meta.totalPages`.
 * Respons tanpa `meta` dianggap hanya satu halaman.
 */
async function fetchList<T>(
  path: string,
  tag: CacheTag,
  schema: z.ZodType<T>,
): Promise<T[]> {
  const items: T[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const pagePath = `${path}?limit=${LIST_LIMIT}&page=${page}`;
    const envelope = envelopeSchema.safeParse(await requestJson(pagePath, tag));
    if (!envelope.success) {
      throw new ApiError(`Bentuk respons ${pagePath} tidak dikenali.`);
    }

    for (const raw of envelope.data.data) {
      const parsed = schema.safeParse(raw);
      if (parsed.success) {
        items.push(parsed.data);
      } else {
        console.error(`[api] Item dari ${path} dilewati: data tidak valid.`);
      }
    }

    const totalPages = envelope.data.meta?.totalPages ?? 1;
    if (page >= totalPages) return items;
  }

  console.error(
    `[api] ${path} punya lebih dari ${MAX_PAGES} halaman; sisanya tidak dimuat.`,
  );
  return items;
}

export function getPortfolio(): Promise<PortfolioItem[]> {
  return fetchList(
    "/api/gallery/v1/portfolio",
    CACHE_TAGS.portfolio,
    galleryItemSchema,
  );
}

/** Galeri pola. Alamat dan tag cache-nya dipakai bersama oleh halaman Galeri dan beranda. */
export function getGallery(): Promise<GalleryItem[]> {
  return fetchList("/api/gallery/v1", CACHE_TAGS.gallery, galleryItemSchema);
}

/** Produk aktif. */
export function getProducts(): Promise<Product[]> {
  return fetchList("/api/products/v1", CACHE_TAGS.products, productSchema);
}

export function getArticles(): Promise<Article[]> {
  return fetchList("/api/article/v1", CACHE_TAGS.articles, articleSchema);
}
