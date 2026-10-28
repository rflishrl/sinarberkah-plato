import { FaWhatsapp } from "react-icons/fa6";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";

export function Contact() {
  const { contact, socialLinks } = siteConfig;

  return (
    <section id="contact" className="bg-surface py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Informasi"
          title="Temukan Bengkel Di Mana Saja dan Kapan Saja"
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <iframe
            title="Lokasi Bengkel Sinar Berkah di Google Maps"
            src={siteConfig.mapEmbedUrl}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="aspect-[4/3] w-full border-0 bg-line sm:aspect-[16/10] lg:aspect-auto lg:min-h-[420px]"
          />

          <div className="flex flex-col gap-8 bg-white p-6 shadow-card sm:p-8">
            <div>
              <h3 className="font-heading text-base font-bold tracking-wide text-brand uppercase">
                Contact Us
              </h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <MdLocationOn
                    size={20}
                    className="mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  <address className="not-italic">{contact.address}</address>
                </li>
                <li>
                  <a
                    href={contact.phoneHref}
                    className="flex min-h-11 items-center gap-3 hover:text-brand"
                  >
                    <MdPhone
                      size={20}
                      className="shrink-0"
                      aria-hidden="true"
                    />
                    {contact.phoneDisplay}
                  </a>
                </li>
                {contact.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex min-h-11 items-center gap-3 hover:text-brand"
                    >
                      <MdEmail
                        size={20}
                        className="shrink-0"
                        aria-hidden="true"
                      />
                      {contact.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-base font-bold tracking-wide text-brand uppercase">
                Sosial Media
              </h3>
              <ul className="mt-2 text-sm">
                <li>
                  <a
                    href={whatsappLink(contact.whatsappGeneral)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-3 hover:text-brand"
                  >
                    <FaWhatsapp
                      size={20}
                      className="shrink-0"
                      aria-hidden="true"
                    />
                    WhatsApp
                  </a>
                </li>
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-11 items-center gap-3 hover:text-brand"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
