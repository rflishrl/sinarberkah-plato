import type { Metadata } from "next";

import { ContentImage } from "@/components/ui/content-image";
import { EmptyState, PageHeader } from "@/components/ui/page-header";
import { getArticles } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Artikel",
  description: "Artikel dan informasi seputar ornamen, plat dan konstruksi.",
};

export default async function ArticlePage() {
  const articles = await getArticles();

  return (
    <>
      <PageHeader title="Artikel" />
      <section className="container-page py-12 lg:py-16">
        {articles.length === 0 ? (
          <EmptyState message="Belum ada artikel." />
        ) : (
          <ul className="divide-y divide-line">
            {articles.map((article) => (
              <li
                key={article._id}
                className="flex flex-col gap-6 py-8 first:pt-0 md:flex-row"
              >
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-line md:w-64">
                  <ContentImage
                    src={article.image.image_url}
                    alt={article.title}
                    sizes="(min-width: 768px) 256px, 100vw"
                    className="object-cover"
                  />
                </div>
                <article className="flex-1">
                  <p className="text-sm font-bold tracking-wider text-brand uppercase">
                    {article.category}
                  </p>
                  <h2 className="mt-1 font-heading text-2xl font-bold">
                    {article.title}
                  </h2>
                  <p className="mt-2 line-clamp-4 text-muted">
                    {article.content}
                  </p>
                  <time
                    dateTime={article.createdAt}
                    className="mt-4 block text-sm text-muted"
                  >
                    {formatDate(article.createdAt)}
                  </time>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
