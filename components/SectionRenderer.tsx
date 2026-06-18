import { slugify } from "@/lib/utils";
import type { Section } from "@/types/sections";
import { EventSection } from "./sections/EventSection";
import { FileUploadSection } from "./sections/FileUploadSection";
import { GalleryPreviewSection } from "./sections/GalleryPreviewSection";
import { HeroSection } from "./sections/HeroSection";
import { NewsletterSection } from "./sections/NewsletterSection";
import { StatementSection } from "./sections/StatementSection";
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
  galleryPreview: GalleryPreviewSection,
  statementSection: StatementSection,
};

function getSectionTitle(section: Section): string | undefined {
  return "heading" in section
    ? (section as { heading?: string }).heading
    : undefined;
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
            <div
              key={section._key}
              id={slugify(getSectionTitle(section)!)}
              className={section._type}
            >
              <FileUploadSection
                key={section._key}
                section={section}
                hasNewsletter={sections.some((s) => s._type === "newsletter")}
              />
            </div>
          );
        }

        return (
          <div
            key={section._key}
            id={slugify(getSectionTitle(section)!)}
            className={section._type}
          >
            <Component section={section} pageType={pageType} />
          </div>
        );
      })}
    </>
  );
}
