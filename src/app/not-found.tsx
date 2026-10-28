import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
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
