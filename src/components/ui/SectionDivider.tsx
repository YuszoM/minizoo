import Image from "next/image";

export function SectionDivider() {
  return (
    <div className="band-divider" aria-hidden>
      <div className="container-site">
        {/* Przycinamy wbudowany pusty parchment u góry pliku — zostaje sam rysunek */}
        <div className="relative mx-auto h-[68px] max-w-4xl overflow-hidden sm:h-[84px] md:h-[96px]">
          <Image
            src="/images/illustrations/divider-branches.jpg"
            alt=""
            fill
            className="object-cover object-bottom"
            sizes="(max-width: 1180px) 90vw, 960px"
          />
        </div>
      </div>
    </div>
  );
}
