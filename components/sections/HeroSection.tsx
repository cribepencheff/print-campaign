"use client";

import { motion } from "framer-motion";
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
      <section className="flex items-center relative not-lg:flex-col gap-sp-xl py-20 not-lg:py-10 w-full min-h-[90dvh]">
        <div className="w-full container mx-auto flex items-center gap-12 not-lg:flex-col">
          <div className="relative flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="heading leading-[0.875] text-[8vw] lg:text-[6vw] xl:text-7xl mb-4 max-w-3xl"
            >
              {section.heading}
            </motion.h1>

            {section.description && (
              <div className="prose prose-lg not-md:prose-base">
                <RichText value={section.description} />
              </div>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center">
            <motion.div
              whileHover={{ rotate: 1 }}
              initial={{ rotate: 1.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <picture className="transition">
                {" "}
                {section.image?.asset && (
                  <Image
                    loading="eager"
                    src={urlFor(section.image).width(100).url()}
                    alt={section.image.alt ?? section.heading}
                    width={section.image.asset.metadata.dimensions.width}
                    height={section.image.asset.metadata.dimensions.height}
                    className="w-full not-lg:max-w-sm object-cover lg:pr-sp-sm"
                  />
                )}
              </picture>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-20 px-8 flex gap-12 items-center max-w-5xl mx-auto`}
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
