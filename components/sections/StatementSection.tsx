"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import type { StatementSection as StatementSectionType } from "@/types/sections";

function Word({
  word,
  progress,
  index,
  total,
}: {
  word: string;
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const threshold = ((index + 1) / total) * 0.75;
  const opacity = useTransform(progress, (v) => (v >= threshold ? 1 : 0.25));
  return <motion.span style={{ opacity }}>{word} </motion.span>;
}

export function StatementSection({
  section,
}: {
  section: StatementSectionType;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.55", "end 0.8"],
  });

  const words = section.text.split(" ");

  return (
    <section
      ref={ref}
      className="min-h-[60dvh] flex items-center xl:text-justify hyphens-auto bg-purple"
    >
      <div className="container mx-auto w-full">
        <p className="whitespace-pre-line text-[9dvw] md:text-6xl lg:text-7xl heading leading-tight md:leading-19 tracking-tighter text-yellow">
          {words.map((word, i) => (
            <Word
              key={i}
              word={word}
              progress={scrollYProgress}
              index={i}
              total={words.length}
            />
          ))}
        </p>
      </div>
    </section>
  );
}
