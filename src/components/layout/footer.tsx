import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";

import { CurrentYear } from "@/components/ui/current-year";
import { footerLinks, siteConfig } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-heading text-2xl font-extrabold tracking-wide uppercase">
            {siteConfig.name}
          </p>
          <p className="mt-2 text-muted">{siteConfig.tagline}</p>
        </div>

        <nav aria-label="Navigasi footer">
          <h2 className="font-heading text-base font-bold tracking-wide uppercase">
            Tentang Kami
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-10 items-center text-muted transition-colors duration-200 hover:text-brand motion-reduce:transition-none"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-heading text-base font-bold tracking-wide uppercase">
            Order Sekarang
          </h2>
          <p className="mt-3 text-muted">
            Pemesanan bisa melalui WhatsApp dengan konsultasi terkait produk
            yang akan dibuat.
          </p>
          <a
            href={whatsappLink(siteConfig.contact.whatsappOrder)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-ink transition-colors duration-200 hover:text-brand motion-reduce:transition-none"
          >
            <FaWhatsapp size={20} aria-hidden="true" />
            Chat via WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="container-page py-5 text-sm text-muted">
          &copy; <CurrentYear serverYear={year} /> {siteConfig.name}. Hak cipta
          dilindungi.
        </p>
      </div>
    </footer>
  );
}
