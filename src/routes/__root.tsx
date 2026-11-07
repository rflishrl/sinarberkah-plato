import {
  createRootRoute,
  ErrorComponentProps,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ButtonLink, buttonStyles } from "@/components/ui/button";
import { siteConfig } from "@/data/site";
import appCss from "@/styles/globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#f7f7f7" },
      { name: "application-name", content: siteConfig.name },
      { title: `${siteConfig.name} | ${siteConfig.tagline}` },
      { name: "description", content: siteConfig.description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: siteConfig.locale },
      { property: "og:site_name", content: siteConfig.name },
      {
        property: "og:title",
        content: `${siteConfig.name} | ${siteConfig.tagline}`,
      },
      { property: "og:description", content: siteConfig.description },
      { property: "og:image", content: `${siteConfig.url}/images/hero-1.png` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: RootErrorComponent,
  notFoundComponent: RootNotFoundComponent,
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="id">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-xs focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Lewati ke konten utama
        </a>
        <Navbar />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 focus:outline-none"
        >
          <Outlet />
        </main>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const errorMessage =
    error instanceof Error ? error.message : "Terjadi kesalahan.";
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="font-heading text-2xl font-bold">Terjadi kesalahan</h1>
      <p className="mt-2 max-w-md text-muted">
        Halaman tidak dapat dimuat saat ini. Silakan coba lagi.
      </p>
      {errorMessage && (
        <p className="mt-2 text-sm text-muted">Pesan: {errorMessage}</p>
      )}
      <button
        type="button"
        onClick={reset}
        className={buttonStyles("primary", "mt-6")}
      >
        Coba Lagi
      </button>
    </section>
  );
}

function RootNotFoundComponent() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-heading text-7xl font-extrabold text-ghost">404</p>
      <h1 className="mt-2 font-heading text-2xl font-bold">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 max-w-md text-muted">
        Halaman yang Anda cari tidak ada atau sudah dipindahkan.
      </p>
      <ButtonLink href="/" className="mt-6">
        Kembali ke Beranda
      </ButtonLink>
    </section>
  );
}
