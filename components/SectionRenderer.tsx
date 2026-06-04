import type { Section } from "@/types/sections";
import { EventSection } from "./sections/EventSection";
import { FileUploadSection } from "./sections/FileUploadSection";
import { HeroSection } from "./sections/HeroSection";
import { NewsletterSection } from "./sections/NewsletterSection";
import { TextSection } from "./sections/TextSection";

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
  newsletter: NewsletterSection,
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

        // Special handling for FileUploadSection to pass hasNewsletter prop
        if (section._type === "fileUpload") {
          return (
            <FileUploadSection
              key={section._key}
              section={section}
              hasNewsletter={sections.some((s) => s._type === "newsletter")}
            />
          );
        }

        return <Component key={section._key} section={section} />;
      })}
    </>
  );
}
