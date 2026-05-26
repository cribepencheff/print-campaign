import type { Section } from "@/types/sections";
import { HeroSection } from "./sections/HeroSection";
import { TextSection } from "./sections/TextSection";

type SectionRegistry = {
  [SectionType in Section["_type"]]: React.ComponentType<{
    section: Extract<Section, { _type: SectionType }>;
  }>;
};

const registry: SectionRegistry = {
  hero: HeroSection,
  textSection: TextSection,
};

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        const Component = registry[section._type] as React.ComponentType<{
          section: Section;
        }>;
        return <Component key={section._key} section={section} />;
      })}
    </>
  );
}
