import type { Section } from "@/types/sections";
import { HeroSection } from "./sections/HeroSection";
import { TextSection } from "./sections/TextSection";
import { EventSection } from "./sections/EventSection";
import { FileUploadSection } from "./sections/FileUploadSection";

type SectionRegistry = {
  [SectionType in Section["_type"]]: React.ComponentType<{
    section: Extract<Section, { _type: SectionType }>;
  }>;
};

const registry: SectionRegistry = {
  hero: HeroSection,
  textSection: TextSection,
  eventList: EventSection,
  fileUpload: FileUploadSection,
};

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        const Component = registry[section._type] as
          | React.ComponentType<{ section: Section }>
          | undefined;

        if (!Component) {
          console.warn("Unknown section type:", section._type);
          return null;
        }

        return <Component key={section._key} section={section} />;
      })}
    </>
  );
}
