import type { Metadata } from "next";

import { ContentImage } from "@/components/ui/content-image";
import { EmptyState, PageHeader } from "@/components/ui/page-header";
import { getGallery } from "@/lib/api";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Galeri Pola",
  description:
    "Koleksi pola ornamen Sinar Berkah. Tersedia pola jadi maupun pola custom sesuai kebutuhan Anda.",
};

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <>
      <PageHeader
        title="Galeri Pola Sinar Berkah"
        description="Pilih pola yang sudah jadi atau kirimkan pola Anda sendiri. Kami akan membuatnya sesuai kebutuhan."
      />
      <section className="container-page py-12 lg:py-16">
        {items.length === 0 ? (
          <EmptyState message="Galeri pola belum tersedia." />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item._id}>
                <figure>
                  <div className="relative aspect-[3/4] w-full overflow-hidden border border-line bg-white">
                    <ContentImage
                      src={item.image.image_url}
                      alt={item.title}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain"
                    />
                  </div>
                  <figcaption className="mt-3">
                    <p className="text-xs font-bold tracking-wider text-brand uppercase">
                      {item.type}
                    </p>
                    <h2 className="font-heading text-lg font-bold">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {item.description}
                    </p>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
