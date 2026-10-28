import type { GalleryItem, PortfolioItem } from "@/types/api";

/**
 * Data bawaan yang dipakai saat API backend belum atau tidak bisa dijangkau,
 * supaya halaman tidak kosong.
 */
export const fallbackPortfolio: PortfolioItem[] = [
  {
    _id: "fallback-portfolio-1",
    title: "Panel ornamen eksterior",
    type: "Ornamen",
    description: "Panel ornamen motif ukir untuk dinding teras rumah.",
    image: { image_url: "/images/portfolio-1.png" },
  },
  {
    _id: "fallback-portfolio-2",
    title: "Railing tangga motif",
    type: "Railing",
    description: "Railing tangga besi dengan panel motif geometris.",
    image: { image_url: "/images/portfolio-2.png" },
  },
  {
    _id: "fallback-portfolio-3",
    title: "Pagar balkon motif daun",
    type: "Pagar",
    description: "Pagar balkon lantai dua dengan panel motif daun.",
    image: { image_url: "/images/portfolio-3.png" },
  },
];

export const fallbackGallery: GalleryItem[] = [
  {
    _id: "fallback-gallery-1",
    title: "Pola LC 071 - LC 075",
    type: "Pola",
    description: "Contoh pola jadi. Kami juga menerima pola custom.",
    image: { image_url: "/images/pattern-gallery.png" },
  },
];
