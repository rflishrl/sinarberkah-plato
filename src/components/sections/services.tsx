import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/data/content";

export function Services() {
  return (
    <section id="services" className="py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Layanan yang tersedia"
          title="Kami Memberikan Pelayanan Terbaik"
        />

        <ul className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3 sm:gap-0">
          {services.map(({ id, icon: Icon, title, description }) => (
            <li key={id} className="border-l border-line px-6">
              <Icon size={36} className="text-ink" aria-hidden="true" />
              <h3 className="mt-3 font-heading text-base font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
