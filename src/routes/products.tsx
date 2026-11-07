import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ProductGrid } from "@/components/sections/product-grid";
import { JsonLd } from "@/components/ui/json-ld";
import { EmptyState, PageHeader } from "@/components/ui/page-header";
import { absoluteUrl, buildHeadMeta } from "@/lib/metadata";
import { getProductsServerFn } from "@/lib/server-fns";

export const productSearchSchema = z.object({
  q: z.string().trim().max(100).default("").catch(""),
});

export const Route = createFileRoute("/products")({
  validateSearch: productSearchSchema,
  loader: () => getProductsServerFn(),
  head: () =>
    buildHeadMeta({
      title: "Produk",
      description: "Daftar produk dan harga dari Sinar Berkah.",
      path: "/products",
    }),
  component: ProductsPage,
});

function ProductsPage() {
  const products = Route.useLoaderData();
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description || undefined,
        image: product.image.image_url
          ? absoluteUrl(product.image.image_url)
          : undefined,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "IDR",
        },
      },
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader title="Produk Sinar Berkah" />
      <section className="container-page py-12 lg:py-16">
        {products.length === 0 ? (
          <EmptyState message="Belum ada produk." />
        ) : (
          <ProductGrid
            products={products}
            query={q}
            onQueryChange={(newQuery) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  q: newQuery,
                }),
                replace: true,
              });
            }}
          />
        )}
      </section>
    </>
  );
}
