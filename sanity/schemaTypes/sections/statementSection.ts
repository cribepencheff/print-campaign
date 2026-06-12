import { defineField, defineType } from "sanity";

export const statementSection = defineType({
  name: "statementSection",
  title: "Statement",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: "text" },
    prepare: ({ title }) => ({
      title: `Statement: ${title ? title.slice(0, 50) + "…" : ""}`,
    }),
  },
});
