import { FileIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Sidor",
  type: "document",
  icon: FileIcon,
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
      description: 'Använd "home" för startsidan.',
    }),
    defineField({
      name: "content",
      title: "Innehåll",
      type: "array",
      of: [
        { type: "hero" },
        { type: "textSection" },
        { type: "eventList" },
        { type: "fileUpload" },
        { type: "newsletter" },
      ],
      validation: (Rule) =>
        Rule.custom((sections: Array<{ _type: string }> = []) => {
          const heroCount = sections.filter((s) => s._type === "hero").length;

          // Hero rules
          if (heroCount > 1)
            return "Endast en hero-sektion per sida är tillåten.";

          // File upload rules
          if (
            (sections?.filter((b) => b._type === "fileUpload").length ?? 0) > 1
          )
            return "Endast ett uppladdningsformulär per sida är tillåtet.";

          // Default validation result
          return true;
        }),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle === "home" ? "/ (startsida)" : `/${subtitle}`,
    }),
  },
});
