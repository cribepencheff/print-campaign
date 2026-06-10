import { defineField, defineType } from "sanity";

export const galleryPreview = defineType({
  name: "galleryPreview",
  title: "Galleri-preview",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: `Galleri-preview${title ? `: ${title}` : ""}`,
    }),
  },
});
