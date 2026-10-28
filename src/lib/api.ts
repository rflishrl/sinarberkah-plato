import { fallbackGallery, fallbackPortfolio } from "@/data/fallback";
import type {
  ApiListResponse,
  Article,
  GalleryItem,
  PortfolioItem,
  Product,
} from "@/types/api";

// Backend: C:\Projects\sinarberkah-backend, sudah di-deploy di Vercel.
// Untuk memakai backend lokal, isi API_BASE_URL=http://localhost:4000 di .env.local.
const API_BASE_URL = (
  process.env.API_BASE_URL ?? "https://sinarberkah-backend.vercel.app"
).replace(/\/$/, "");

const REVALIDATE_SECONDS = 60 * 60;
const REQUEST_TIMEOUT_MS = 4_000;

/**
 * Mengambil daftar dari API. Mengembalikan `null` jika permintaan gagal,
 * dan array kosong jika API berhasil tetapi tidak ada data.
 */
async function fetchList<T>(path: string): Promise<T[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const body = (await response.json()) as Partial<ApiListResponse<T>>;
    return Array.isArray(body.data) ? body.data : [];
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error(`[api] Gagal memuat ${path}: ${reason}`);
    return null;
  }
}

/** Portofolio dari API, atau data bawaan jika API tidak tersedia. */
export async function getPortfolio(): Promise<PortfolioItem[]> {
  const items = await fetchList<PortfolioItem>("/api/gallery/v1/portfolio");
  return items?.length ? items : fallbackPortfolio;
}

/** Galeri pola dari API, atau data bawaan jika API tidak tersedia. */
export async function getGallery(): Promise<GalleryItem[]> {
  const items = await fetchList<GalleryItem>("/api/gallery/v1");
  return items?.length ? items : fallbackGallery;
}

/** Pola dari API saja (tanpa data cadangan). Kosong jika API gagal atau belum ada data. */
export async function getPatterns(): Promise<GalleryItem[]> {
  return (await fetchList<GalleryItem>("/api/gallery/v1")) ?? [];
}

/** Produk aktif dari API. `null` berarti gagal dimuat (berbeda dengan belum ada produk). */
export async function getProducts(): Promise<Product[] | null> {
  return fetchList<Product>("/api/products/v1?limit=100");
}

/** Artikel dari API. `null` berarti gagal dimuat (berbeda dengan belum ada artikel). */
export async function getArticles(): Promise<Article[] | null> {
  return fetchList<Article>("/api/article/v1");
}
