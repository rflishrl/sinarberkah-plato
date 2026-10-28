"use client";

import { buttonStyles } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h1 className="font-heading text-2xl font-bold">Terjadi kesalahan</h1>
      <p className="mt-2 max-w-md text-muted">
        Halaman tidak dapat dimuat saat ini. Silakan coba lagi.
      </p>
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
