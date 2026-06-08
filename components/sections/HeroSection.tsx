import { Image } from "next-sanity/image";
import { RichText } from "@/components/RichText";
import { urlFor } from "@/sanity/lib/image";
import type { HeroSection as HeroSectionType } from "@/types/sections";

export function HeroSection({
  section,
  pageType,
}: {
  section: HeroSectionType;
  pageType?: string;
}) {
  if (pageType === "home") {
    return (
      <section className="py-20 px-8 text-center max-w-2xl mx-auto">
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{section.heading}</h1>
          {section.description && (
            <div className="prose prose-lg">
              <RichText value={section.description} />
            </div>
          )}
        </div>

        {section.image?.asset && (
          <Image
            loading="eager"
            src={urlFor(section.image).width(800).url()}
            alt={section.image.alt ?? section.heading}
            width={800}
            height={500}
            className="rounded-lg w-full object-cover mt-8"
          />
        )}
      </section>
    );
  }

  return (
    <section
      className={`py-20 px-8 flex gap-12 items-center max-w-5xl mx-auto" : "text-center max-w-2xl mx-auto"}`}
    >
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-4">{section.heading}</h1>
        {section.description && (
          <div className="prose prose-lg">
            <RichText value={section.description} />
          </div>
        )}
      </div>

      {section.image?.asset && (
        <Image
          loading="eager"
          src={urlFor(section.image).width(800).url()}
          alt={section.image.alt ?? section.heading}
          width={800}
          height={500}
          className="rounded-lg w-full object-cover"
        />
      )}
    </section>
  );
}
