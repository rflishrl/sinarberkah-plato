export interface ApiImage {
  image_url: string;
}

export interface ApiListResponse<T> {
  data: T[];
}

/** Item galeri dan portofolio dikembalikan API dengan bentuk yang sama. */
export interface GalleryItem {
  _id: string;
  title: string;
  type: string;
  description: string;
  image: ApiImage;
}

export type PortfolioItem = GalleryItem;

export interface Article {
  _id: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  image: ApiImage;
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

/** Produk dari API backend (`GET /api/products/v1`). */
export interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: ApiImage;
  isActive: boolean;
}
