import { ButtonLink } from "@/components/ui/button";
import { materials } from "@/data/content";
import { siteConfig } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";

export function Materials() {
  return (
    <section id="materials" className="py-16 lg:py-24">
      <div className="container-page grid items-center gap-10 md:grid-cols-2 lg:mx-auto lg:max-w-[808px] lg:grid-cols-[372px_372px] lg:justify-between lg:gap-0 lg:px-0">
        <ul className="mx-auto grid w-full max-w-[372px] grid-cols-2 gap-4 sm:gap-5">
          {materials.map((material) => (
            <li
              key={material.name}
              className="flex flex-col gap-4 bg-white px-4 py-[18px] shadow-card sm:gap-[25px] sm:px-[22px] lg:min-h-[154px]"
            >
              <h3 className="text-center font-heading text-base leading-5 font-bold">
                {material.name}
              </h3>
              <ul className="flex flex-col gap-2 text-sm leading-[19px] font-medium text-[#444]">
                <li>{material.thickness}</li>
                {material.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div>
          <p className="text-sm font-bold tracking-wider text-brand uppercase">
            Bahan Bahan
          </p>
          <h2 className="mt-2 font-heading text-2xl leading-tight font-bold text-balance">
            Kami Memiliki Bahan Sesuai Kebutuhan
          </h2>
          <p className="mt-4 text-lg text-muted">
            Pilihlah sesuai kebutuhan dan kondisi ornamen anda
          </p>
          <p className="mt-3 text-sm text-muted">
            Setiap bahan memiliki kegunaan kekurangan serta kelebihan
            masing-masing maka dapat disesuaikan dengan kondisi yang ada
          </p>
          <ButtonLink
            href={whatsappLink(
              siteConfig.contact.whatsappGeneral,
              "Halo, saya ingin konsultasi soal bahan.",
            )}
            className="mt-6"
          >
            Konsultasi Sekarang
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
