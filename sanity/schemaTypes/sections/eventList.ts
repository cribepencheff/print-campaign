import { defineField, defineType } from "sanity";
import { slugify } from "@/lib/utils";

export const eventList = defineType({
  name: "eventList",
  title: "Turnédatum (lista)",
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
      title: `Turnédatum: ${title ? `: ${title}` : ""}`,
      subtitle: `ID: #${slugify(title ?? "")}`,
    }),
  },
});
