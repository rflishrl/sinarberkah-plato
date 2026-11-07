import { createServerFn } from "@tanstack/react-start";

import { getArticles, getGallery, getPortfolio, getProducts } from "@/lib/api";
import type { Article, GalleryItem, PortfolioItem, Product } from "@/types/api";

export const getPortfolioServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<PortfolioItem[]> => {
    try {
      return await getPortfolio();
    } catch (error) {
      console.error("[api] Gagal mengambil portfolio di server:", error);
      return [];
    }
  },
);

export const getGalleryServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<GalleryItem[]> => {
    try {
      return await getGallery();
    } catch (error) {
      console.error("[api] Gagal mengambil galeri di server:", error);
      return [];
    }
  },
);

export const getProductsServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<Product[]> => {
    try {
      return await getProducts();
    } catch (error) {
      console.error("[api] Gagal mengambil produk di server:", error);
      return [];
    }
  },
);

export const getArticlesServerFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<Article[]> => {
    try {
      return await getArticles();
    } catch (error) {
      console.error("[api] Gagal mengambil artikel di server:", error);
      return [];
    }
  },
);
