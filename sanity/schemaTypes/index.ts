import { type SchemaTypeDefinition } from "sanity";

import { event } from "./documents/event";
import { galleryPage } from "./documents/galleryPage";
import { motiveSubmission } from "./documents/motiveSubmission";
import { page } from "./documents/page";
import { eventList } from "./sections/eventList";
import { fileUpload } from "./sections/fileUpload";
import { hero } from "./sections/hero";
import { newsletter } from "./sections/newsletter";
import { textSection } from "./sections/textSection";
import { settings } from "./singletons/settings";
import { blockContent, simpleBlockContent } from "./ui/blockContent";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Page types
    page,
    event,
    galleryPage,
    motiveSubmission,

    // Sections - Reusable content blocks that can be added to pages
    hero,
    textSection,
    eventList,
    fileUpload,
    newsletter,

    // UI - Custom input components and portable text definitions
    blockContent,
    simpleBlockContent,

    // Glopbal singletons
    settings,
  ],
};
