import { MdPlayArrow } from "react-icons/md";

import { ContentImage } from "@/components/ui/content-image";
import { siteConfig } from "@/data/site";

const watchVideoStyles =
  "group inline-flex items-center gap-4 font-heading text-base font-semibold text-brand lowercase";
const playIconStyles =
  "inline-flex h-[43px] w-[42px] items-center justify-center bg-brand text-white transition-colors duration-200 motion-reduce:transition-none";

/** Tata letak desktop mengikuti frame Figma: area 808px, foto 372px + teks 372px. */
export function About() {
  const { aboutVideoUrl } = siteConfig;

  return (
    <section id="about" className="py-16 lg:pt-[200px] lg:pb-24">
      <div className="container-page grid items-start gap-10 md:grid-cols-2 lg:mx-auto lg:max-w-[808px] lg:grid-cols-[372px_372px] lg:justify-between lg:gap-0 lg:px-0">
        {/* Dua foto bertumpuk */}
        <div className="relative mx-auto aspect-[372/410] w-full max-w-[372px]">
          <div className="absolute top-0 left-0 h-[76.1%] w-[67.2%] shadow-photo">
            <ContentImage
              src="/images/about-grinding.png"
              alt="Pekerja menggerinda rangka besi hingga memercikkan api"
              sizes="(min-width: 1024px) 250px, 60vw"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-0 h-[79%] w-[67.2%] shadow-photo">
            <ContentImage
              src="/images/about-welding.png"
              alt="Pekerja mengelas pipa besi di dalam bengkel"
              sizes="(min-width: 1024px) 250px, 60vw"
              className="object-cover object-[25%_50%]"
            />
          </div>
        </div>

        <div className="lg:pt-[86px]">
          <p className="text-sm leading-[19px] font-bold tracking-normal text-brand uppercase">
            Tentang Kami
          </p>
          <h2 className="mt-3.5 font-heading text-2xl leading-[30px] font-bold text-ink">
            Kami Sudah Sangat Berpengalaman
          </h2>
          <p className="mt-3 text-lg leading-[25px] font-medium text-muted">
            Sudah terjun ke bidang industri, fabrikasi, dan konstruksi lebih
            dari 5 tahun
          </p>
          <p className="mt-8 text-sm leading-[19px] font-medium text-muted">
            Tidak ada keraguan lagi untuk bermitra dengan kami karena memang
            pengalaman kami yang sudah sangat ahli di bidangnya
          </p>

          <div className="mt-9">
            {aboutVideoUrl ? (
              <a
                href={aboutVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={watchVideoStyles}
              >
                <span
                  className={`${playIconStyles} group-hover:bg-brand-hover`}
                >
                  <MdPlayArrow size={28} aria-hidden="true" />
                </span>
                watch video
              </a>
            ) : (
              // TODO: isi `aboutVideoUrl` di src/data/site.ts agar tombol ini aktif.
              <button
                type="button"
                disabled
                aria-label="Watch video (belum tersedia)"
                className={`${watchVideoStyles} cursor-default`}
              >
                <span className={playIconStyles}>
                  <MdPlayArrow size={28} aria-hidden="true" />
                </span>
                watch video
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
