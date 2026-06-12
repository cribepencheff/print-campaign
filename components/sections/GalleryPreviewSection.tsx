"use client";

import { motion } from "framer-motion";
import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/Button";
import type { GalleryPreviewSection as GalleryPreviewSectionType } from "@/types/sections";

export function GalleryPreviewSection({
  section,
}: {
  section: GalleryPreviewSectionType;
}) {
  const { heading, description, images, gallerySlug } = section;
  const href = gallerySlug ? `/${gallerySlug}` : "/galleri";

  return (
    <section className="bg-[linear-gradient(355deg,var(--color-yellow),transparent_30%)]">
      <div className="flex flex-col w-full container mx-auto">
        {heading && <h2 className="text-4xl max-w-2xl mb-4">{heading}</h2>}
        {description && (
          <div className="prose prose-lg not-md:prose-base">
            <p>{description}</p>
          </div>
        )}

        {images?.length > 0 && (
          <motion.div
            className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {images.map((image) => (
              <motion.div
                key={image._key}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      opacity: { duration: 0.3, ease: "easeOut" },
                      y: { type: "spring", bounce: 0.7, duration: 0.7 },
                    },
                  },
                }}
                whileHover={{ rotate: 0.7 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                style={{ willChange: "transform" }}
                className="relative aspect-4/5 overflow-hidden rounded"
              >
                <Image
                  src={image.asset.url}
                  alt={image.alt ?? image.caption ?? "Motiv"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <Button
          href={href}
          variant="outline"
          icon={<ArrowUpRightIcon />}
          className="mt-8 md:mt-12 ml-auto max-w-fit bg-yellow text-black hover:bg-yellow"
        >
          Fler tryck
        </Button>
      </div>
    </section>
  );
}
