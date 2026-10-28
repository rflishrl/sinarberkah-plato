import type { Metadata } from "next";

import { ProductGrid } from "@/components/sections/product-grid";
import { EmptyState, PageHeader } from "@/components/ui/page-header";
import { getProducts } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Produk",
  description: "Daftar produk dan harga dari Sinar Berkah.",
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <PageHeader title="Produk Sinar Berkah" />
      <section className="container-page py-12 lg:py-16">
        {products.length === 0 ? (
          <EmptyState message="Belum ada produk." />
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </>
  );
}
