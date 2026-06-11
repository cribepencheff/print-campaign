"use client";

import type { PortableTextBlock } from "@portabletext/types";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { PortableText } from "next-sanity";
import { useEffect, useState } from "react";

type GalleryImage = {
  _key: string;
  alt?: string;
  caption?: string;
  asset: { url: string };
};

type Props = {
  title: string;
  description?: PortableTextBlock[];
  images?: GalleryImage[];
};

export function GalleryPage({ title, description, images }: Props) {
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <>
      <section>
        <div className="flex flex-col w-full container mx-auto">
          <h1 className="heading text-5xl lg:text-6xl mb-4">{title}</h1>

          {description && (
            <div className="prose prose-lg not-md:prose-base mb-12">
              <PortableText value={description} />
            </div>
          )}

          {images && images.length > 0 && (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07 } },
              }}
            >
              {images.map((image) => (
                <motion.figure
                  key={image._key}
                  className="flex flex-col gap-2 cursor-pointer"
                  onClick={() => setSelected(image)}
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
                >
                  <div className="relative aspect-4/5 overflow-hidden group">
                    <Image
                      src={image.asset.url}
                      alt={image.alt ?? image.caption ?? "Motiv"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {image.caption && (
                      <figcaption className="absolute inset-x-0 bottom-0 bg-black/60 to-transparent p-3 text-white text-xs translate-y-0 [@media(hover:hover)]:translate-y-full [@media(hover:hover)]:group-hover:translate-y-0 transition-transform duration-200 ease-out">
                        {image.caption}
                      </figcaption>
                    )}
                  </div>
                </motion.figure>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 p-4 md:p-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Stäng"
              className="absolute top-sp-sm right-sp-sm lg:right-sp-lg p-sp-sm flex items-center justify-center rounded-full bg-white hover:bg-yellow cursor-pointer focus:outline-none focus-visible:ring-2"
            >
              <X size={20} />
            </button>

            <div
              className="relative w-full max-w-2xl max-h-[80dvh] aspect-4/5"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selected.asset.url}
                alt={selected.alt ?? selected.caption ?? "Motiv"}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>

            {selected.caption && (
              <p className="mt-4 text-white text-sm text-center max-w-md">
                {selected.caption}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
