"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/Button";
import { formatEventDate } from "@/lib/utils";
import type { EventSection as EventSectionType } from "@/types/sections";

export function EventSection({ section }: { section: EventSectionType }) {
  return (
    <section className="py-24 px-8 pt-26 sm:pt-32 bg-purplelight/60">
      <div className="flex flex-col w-full max-w-container mx-auto">
        {section.heading && (
          <h2 className="text-4xl max-w-2xl font-bold mb-4">
            {section.heading}
          </h2>
        )}
        {section.description && (
          <div className="prose prose-lg not-md:prose-base">
            <p>{section.description}</p>
          </div>
        )}

        {section.events && (
          <ul className="mt-8">
            {section.events.map((event, i) => (
              <motion.li
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.08 }}
                className="p-sp-xs rounded bg-white flex flex-row items-start md:items-center not-md:flex-wrap mb-sp-sm md:mb-sp-xs gap-sp-xs md:gap-sp-md"
              >
                {event.date && (
                  <div className="flex flex-col items-center md:w-14 ml-1">
                    <p className="heading text-1xl leading-3 tracking-wide">
                      {formatEventDate(event.date).weekday}
                    </p>

                    <p className="heading text-1xl leading-4">
                      {formatEventDate(event.date).date}{" "}
                      {formatEventDate(event.date).month}
                    </p>
                  </div>
                )}{" "}
                <div className="flex-1 text-sm not-md:order-first">
                  <p>{event.title}</p>
                  <p>{event.location}</p>
                </div>
                {event.location && (
                  <div className="w-full md:w-auto">
                    <Button
                      variant="accent"
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                      targetBlank
                      icon={<MapPin size={20} />}
                      className="py-0.75 px-2 pr-3 text-md"
                    >
                      Hitta hit
                    </Button>
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
