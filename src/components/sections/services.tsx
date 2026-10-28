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

        <ul className="mx-auto mt-12 grid max-w-[715px] gap-8 sm:grid-cols-3 sm:gap-0">
          {services.map(({ id, icon: Icon, title, description }) => (
            <li
              key={id}
              className="py-1.5 sm:border-l sm:border-line sm:px-6 sm:first:border-l-0 sm:first:pl-2.5"
            >
              <Icon size={46} className="text-ink" aria-hidden="true" />
              <h3 className="mt-2 font-heading text-base leading-5 font-bold">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-[18px] font-medium text-muted">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
