import { type SchemaTypeDefinition } from "sanity";
import { settings } from "./singletons/settings";

import { page } from "./documents/page";
import { galleryPage } from "./documents/galleryPage";
import { event } from "./documents/event";
import { motiveSubmission } from "./documents/motiveSubmission";

import { hero } from "./sections/hero";
import { textSection } from "./sections/textSection";
import { eventList } from "./sections/eventList";
import { fileUpload } from "./sections/fileUpload";

import { blockContent } from "./ui/blockContent";
import { simpleBlockContent } from "./ui/simpleBlockContent";

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

    // UI - Custom input components and portable text definitions
    blockContent,
    simpleBlockContent,

    // Glopbal singletons
    settings,
  ],
};
