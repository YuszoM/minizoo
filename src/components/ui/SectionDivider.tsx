import Image from "next/image";

export function SectionDivider() {
  return (
    <div className="container-site py-2" aria-hidden>
      <div className="relative mx-auto max-w-4xl opacity-90">
        <Image
          src="/images/illustrations/divider-branches.jpg"
          alt=""
          width={2048}
          height={878}
          className="h-auto w-full"
          sizes="(max-width: 1180px) 90vw, 960px"
        />
      </div>
    </div>
  );
}
