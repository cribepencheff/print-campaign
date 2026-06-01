import { defineField, defineType } from "sanity";

export const eventList = defineType({
  name: "eventList",
  title: "Evenemangslista",
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
    defineField({
      name: "events",
      title: "Evenemang",
      type: "array",
      of: [{ type: "reference", to: [{ type: "event" }] }],
      hidden: true,
    }),
  ],
  preview: {
    select: { title: "heading", eventCount: "events.length" },
    prepare: ({ title, eventCount }) => ({
      title: `Evenemangslista${title ? `: ${title}` : ""}`,
      subtitle: `Alla evenemang`,
    }),
  },
});
