import { SectionHeading } from "@/components/ui/section-heading";

interface PageHeaderProps {
  title: string;
  description?: string;
}

/** Judul halaman dalam (Portofolio, Galeri, Artikel, Produk). Memakai satu `h1`. */
export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="bg-surface py-12 lg:py-16">
      <div className="container-page">
        <SectionHeading
          as="h1"
          title={title}
          description={description}
          className="[&_h1]:sm:text-4xl"
        />
      </div>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="mx-auto max-w-md py-16 text-center text-muted" role="status">
      {message}
    </p>
  );
}
