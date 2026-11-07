import { createFileRoute } from "@tanstack/react-router";

import { ContentImage } from "@/components/ui/content-image";
import { EmptyState, PageHeader } from "@/components/ui/page-header";
import { buildHeadMeta } from "@/lib/metadata";
import { getPortfolioServerFn } from "@/lib/server-fns";

export const Route = createFileRoute("/portfolio")({
  loader: () => getPortfolioServerFn(),
  head: () =>
    buildHeadMeta({
      title: "Portofolio",
      description:
        "Proyek ornamen, railing, pagar dan sketsel yang pernah dikerjakan Sinar Berkah.",
      path: "/portfolio",
    }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const items = Route.useLoaderData();

  return (
    <>
      <PageHeader
        title="Portofolio Sinar Berkah"
        description="Setiap proyek adalah kesempatan untuk menghasilkan ornamen yang unik dan bernilai. Berikut sebagian proyek yang pernah kami kerjakan."
      />
      <section className="container-page py-12 lg:py-16">
        {items.length === 0 ? (
          <EmptyState message="Portofolio belum tersedia." />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((item) => (
              <li key={item._id} className="flex flex-col bg-surface p-5">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-line">
                  <ContentImage
                    src={item.image.image_url}
                    alt={item.title}
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-4 text-xs font-bold tracking-wider text-brand uppercase">
                  {item.type}
                </p>
                <h2 className="mt-1 font-heading text-lg font-bold">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm text-muted">{item.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
