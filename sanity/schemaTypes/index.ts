import { type SchemaTypeDefinition } from "sanity";
import { settings } from "./singletons/settings";
import { page } from "./documents/page";
import { hero } from "./sections/hero";
import { textSection } from "./sections/textSection";
import { blockContent } from "./ui/blockContent";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Page types
    page,

    // Sections - Reusable content blocks that can be added to pages
    hero,
    textSection,

    // UI - Custom input components and portable text definitions
    blockContent,

    // Glopbal singletons
    settings,
  ],
};
