import { defineField, defineType } from "sanity";

export const fileUpload = defineType({
  name: "fileUpload",
  title: "Uppladdningsformulär",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Beskrivning / instruktioner",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: `Uppladdning: ${title ?? "-"}` }),
  },
});
