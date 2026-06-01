import { type SchemaTypeDefinition } from "sanity";
import { settings } from "./singletons/settings";

import { page } from "./documents/page";
import { event } from "./documents/event";
import { motiveSubmission } from "./documents/motiveSubmission";

import { hero } from "./sections/hero";
import { textSection } from "./sections/textSection";
import { eventList } from "./sections/eventList";
import { fileUpload } from "./sections/fileUpload";

import { blockContent } from "./ui/blockContent";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Page types
    page,
    event,
    motiveSubmission,

    // Sections - Reusable content blocks that can be added to pages
    hero,
    textSection,
    eventList,
    fileUpload,

    // UI - Custom input components and portable text definitions
    blockContent,

    // Glopbal singletons
    settings,
  ],
};
