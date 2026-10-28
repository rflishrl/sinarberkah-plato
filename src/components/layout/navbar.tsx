"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { MdClose, MdMenu } from "react-icons/md";

import { ButtonLink } from "@/components/ui/button";
import { navLinks, siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const isScrolled = () => window.scrollY > 8;
const isScrolledOnServer = () => false;

export function Navbar() {
  const pathname = usePathname();
  const menuId = useId();
  const [openPath, setOpenPath] = useState<string | null>(null);
  // Menu otomatis menutup saat berpindah halaman, tanpa perlu effect tambahan.
  const isOpen = openPath === pathname;
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    isScrolled,
    isScrolledOnServer,
  );
  // Di beranda, navbar transparan di atas hero (seperti desain Figma)
  // dan baru berlatar saat halaman digulir.
  const isTransparent = pathname === "/" && !scrolled && !isOpen;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPath(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const contactHref = whatsappLink(siteConfig.contact.whatsappGeneral);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200 motion-reduce:transition-none",
        isTransparent
          ? "border-transparent bg-transparent"
          : "border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80",
      )}
    >
      <div className="container-page flex h-16 items-center gap-6 lg:h-[86px] lg:gap-0">
        <Link
          href="/"
          className="font-sans text-xl font-extrabold text-ink uppercase sm:text-2xl"
        >
          {siteConfig.name}
        </Link>

        <nav
          aria-label="Navigasi utama"
          className="hidden lg:ml-[52px] lg:block"
        >
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavItem href={link.href} active={pathname === link.href}>
                  {link.label}
                </NavItem>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden lg:block">
          <ButtonLink href={contactHref}>Hubungi kami</ButtonLink>
        </div>

        <button
          type="button"
          className="-mr-2 ml-auto inline-flex size-11 cursor-pointer items-center justify-center rounded-xs text-ink lg:hidden"
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={() => setOpenPath(isOpen ? null : pathname)}
        >
          {isOpen ? <MdClose size={26} /> : <MdMenu size={26} />}
        </button>
      </div>

      <div
        id={menuId}
        hidden={!isOpen}
        className="border-t border-line bg-surface lg:hidden"
      >
        <nav aria-label="Navigasi seluler" className="container-page py-3">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavItem
                  href={link.href}
                  active={pathname === link.href}
                  className="flex min-h-12 items-center"
                >
                  {link.label}
                </NavItem>
              </li>
            ))}
          </ul>
          <ButtonLink href={contactHref} className="mt-3 w-full">
            Hubungi Kami
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}

function NavItem({
  href,
  active,
  className,
  children,
}: {
  href: string;
  active: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "text-base font-medium transition-colors duration-200 motion-reduce:transition-none",
        active ? "text-brand" : "text-muted hover:text-brand",
        className,
      )}
    >
      {children}
    </Link>
  );
}
