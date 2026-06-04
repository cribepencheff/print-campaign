import { Image } from "next-sanity/image";
import { urlFor } from "@/sanity/lib/image";
import type { HeroSection as HeroSectionType } from "@/types/sections";

export function HeroSection({ section }: { section: HeroSectionType }) {
  const isSplit = section.layout === "split";

  return (
    <section
      className={`py-20 px-8 ${isSplit ? "flex gap-12 items-center max-w-5xl mx-auto" : "text-center max-w-2xl mx-auto"}`}
    >
      <div className={isSplit ? "flex-1" : ""}>
        <h1 className="text-4xl font-bold mb-4">{section.title}</h1>
        {section.description && (
          <p className="text-lg text-gray-600 mb-8">{section.description}</p>
        )}
        {section.cta?.text && section.cta.url && (
          <a
            href={section.cta.url}
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            {section.cta.text}
          </a>
        )}
      </div>

      {section.image?.asset && (
        <div className={isSplit ? "flex-1" : "mt-10 mx-auto max-w-lg"}>
          <Image
            loading="eager"
            src={urlFor(section.image).width(800).url()}
            alt={section.image.alt ?? section.title}
            width={800}
            height={500}
            className="rounded-lg w-full object-cover"
          />
        </div>
      )}
    </section>
  );
}
