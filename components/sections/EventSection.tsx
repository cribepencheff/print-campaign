"use client";

import { motion } from "framer-motion";
import { MapPin, MapPinOff } from "lucide-react";
import { Button } from "@/components/Button";
import { formatEventDate } from "@/lib/utils";
import type { EventSection as EventSectionType } from "@/types/sections";

export function EventSection({ section }: { section: EventSectionType }) {
  return (
    <section className="bg-purplelight/60">
      <div className="flex flex-col w-full container mx-auto">
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
          <motion.ul
            className="mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {section.events.map((event) => (
              <motion.li
                key={event._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: "easeOut" },
                  },
                }}
                className="p-sp-xs rounded bg-white flex flex-row items-start md:items-center not-md:flex-wrap mb-sp-sm md:mb-sp-xs gap-y-sp-xs gap-x-sp-sm md:gap-x-sp-md"
              >
                {event.date && (
                  <div className="flex flex-col items-center md:w-14 ml-1 mb-0.75 not-md:mt-0.5 gap-0.5">
                    <p className="heading text-sm tracking-wide leading-sp-sm">
                      {formatEventDate(event.date).weekday}
                    </p>

                    <p className="heading text-2xl leading-sp-sm">
                      {formatEventDate(event.date).date}/
                      {formatEventDate(event.date).month}
                    </p>
                  </div>
                )}{" "}
                <div className="flex-1 text-sm">
                  <p>{event.title}</p>
                  <p className="opacity-60">{event.location}</p>
                </div>
                <div className="flex not-md:w-full not-md:justify-end">
                  {event.location ? (
                    <Button
                      variant="accent"
                      size="small"
                      href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                      targetBlank
                      icon={<MapPin size={20} />}
                      className="not-md:w-auto"
                    >
                      Karta
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      icon={<MapPinOff size={20} />}
                      className="not-md:w-auto bg-red pointer-events-none"
                      disabled
                    >
                      Karta
                    </Button>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
