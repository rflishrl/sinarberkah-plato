import { patternSlides } from "@/data/content";
import type { GalleryItem, PatternSlide } from "@/types/api";

/**
 * Mengubah pola dari API menjadi slide: satu pola satu slide, hanya gambar.
 * Jika belum ada pola di API, dipakai gambar deretan pola bawaan.
 */
export function buildPatternSlides(items: GalleryItem[]): PatternSlide[] {
  if (items.length === 0) return patternSlides;

  return items.map((item) => ({
    id: item._id,
    kind: "image" as const,
    src: item.image.image_url,
    alt: item.title,
  }));
}
