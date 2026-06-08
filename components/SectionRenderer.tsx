import { slugify } from "@/lib/utils";
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

function getSectionTitle(section: Section): string | undefined {
  return section.heading as string;
}

export function SectionRenderer({
  sections,
  pageType,
}: {
  sections: Section[];
  pageType?: string;
}) {
  return (
    <>
      {sections.map((section) => {
        const Component = registry[section._type] as
          | React.ComponentType<{ section: Section; pageType?: string }>
          | undefined;

        if (!Component) {
          console.warn("Unknown section type:", section._type);
          return null;
        }

        // Special handling for FileUploadSection to pass hasNewsletter prop
        if (section._type === "fileUpload") {
          return (
            <div key={section._key} id={slugify(getSectionTitle(section)!)}>
              <FileUploadSection
                key={section._key}
                section={section}
                hasNewsletter={sections.some((s) => s._type === "newsletter")}
              />
            </div>
          );
        }

        return (
          <div key={section._key} id={slugify(getSectionTitle(section)!)}>
            <Component section={section} pageType={pageType} />
          </div>
        );
      })}
    </>
  );
}
