"use client";

import { useId, useMemo, useState } from "react";
import { MdSearch } from "react-icons/md";

import { ContentImage } from "@/components/ui/content-image";
import { EmptyState } from "@/components/ui/page-header";
import { siteConfig } from "@/data/site";
import { formatRupiah } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import type { Product } from "@/types/api";

export function ProductGrid({ products }: { products: Product[] }) {
  const inputId = useId();
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term),
    );
  }, [products, query]);

  return (
    <div>
      <div className="mx-auto mb-10 max-w-sm">
        <label htmlFor={inputId} className="sr-only">
          Cari produk
        </label>
        <div className="relative">
          <MdSearch
            size={20}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari produk"
            className="min-h-11 w-full rounded-xs border border-muted bg-white py-2 pr-3 pl-10 text-base"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState message="Produk tidak ditemukan." />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((product) => (
            <li key={product._id} className="flex flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-line">
                {product.image.image_url ? (
                  <ContentImage
                    src={product.image.image_url}
                    alt={product.name}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-sm text-muted">
                    Tanpa foto
                  </div>
                )}
              </div>
              {product.category && (
                <p className="mt-3 text-xs tracking-wider text-muted uppercase">
                  {product.category}
                </p>
              )}
              <h2 className="font-heading text-lg font-bold">{product.name}</h2>
              <p className="mt-1 font-semibold">
                {formatRupiah(product.price)}
              </p>
              {product.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {product.description}
                </p>
              )}
              <a
                href={whatsappLink(
                  siteConfig.contact.whatsappOrder,
                  `Halo, saya tertarik dengan produk ${product.name}.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-11 items-center self-start text-sm font-semibold text-brand hover:text-brand-hover"
              >
                Tanya via WhatsApp
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
