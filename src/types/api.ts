import { z } from "zod";

/*
 * Skema respons API backend. Dipakai di `src/lib/api.ts` untuk memeriksa data saat jalan,
 * dan tipe TypeScript di bawahnya diturunkan dari skema yang sama.
 * `image_url` boleh kosong (produk tanpa foto).
 */
const apiImageSchema = z.object({ image_url: z.string() });

/** Item galeri dan portofolio dikembalikan API dengan bentuk yang sama. */
export const galleryItemSchema = z.object({
  _id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  image: apiImageSchema,
});

export const articleSchema = z.object({
  _id: z.string(),
  title: z.string(),
  category: z.string(),
  content: z.string(),
  createdAt: z.string(),
  image: apiImageSchema,
});

export const productSchema = z.object({
  _id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  price: z.number(),
  image: apiImageSchema,
  isActive: z.boolean(),
});

export type ApiImage = z.infer<typeof apiImageSchema>;
export type GalleryItem = z.infer<typeof galleryItemSchema>;
export type PortfolioItem = GalleryItem;
export type Article = z.infer<typeof articleSchema>;
/** Produk dari API backend (`GET /api/products/v1`). */
export type Product = z.infer<typeof productSchema>;

export interface ApiListResponse<T> {
  data: T[];
}

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  image: { src: string; alt: string };
}

export interface Service {
  id: string;
  title: string;
  description: string;
}

export interface Material {
  name: string;
  thickness: string;
  notes: string[];
}

/**
 * Satu slide galeri pola di beranda:
 * - image: satu pola dari API (hanya gambar, tanpa label)
 * - strip: satu gambar berisi deretan pola (data cadangan saat API kosong atau mati)
 */
export type PatternSlide =
  | { id: string; kind: "image"; src: string; alt: string }
  | { id: string; kind: "strip"; src: string; alt: string };
