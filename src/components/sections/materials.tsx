import { ButtonLink } from "@/components/ui/button";
import { materials } from "@/data/content";
import { siteConfig } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";

export function Materials() {
  return (
    <section id="materials" className="py-16 lg:py-24">
      <div className="container-page grid items-center gap-10 md:grid-cols-2 lg:gap-14">
        <ul className="mx-auto grid w-full max-w-[420px] grid-cols-2 gap-4 sm:gap-5 lg:mx-0">
          {materials.map((material) => (
            <li
              key={material.name}
              className="flex flex-col justify-between rounded-xs bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-photo sm:p-6"
            >
              <div>
                <h3 className="text-center font-heading text-base leading-5 font-bold text-ink">
                  {material.name}
                </h3>
                <ul className="mt-3 flex flex-col gap-2 text-sm leading-[19px] font-medium text-muted">
                  <li>{material.thickness}</li>
                  {material.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>

        <div>
          <p className="text-sm font-bold tracking-wider text-brand uppercase">
            Bahan Bahan
          </p>
          <h2 className="mt-2 font-heading text-2xl leading-tight font-bold text-balance lg:text-3xl">
            Kami Memiliki Bahan Sesuai Kebutuhan
          </h2>
          <p className="mt-4 text-base text-muted lg:text-lg">
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
