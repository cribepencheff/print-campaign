import { defineField, defineType } from "sanity";

export const textSection = defineType({
  name: "textSection",
  title: "Textsektion",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Text",
      type: "blockContent",
    }),
    defineField({
      name: "background",
      title: "Bakgrundsfärg",
      type: "string",
      options: {
        list: [
          { title: "Vit", value: "white" },
          { title: "Grå", value: "gray" },
          { title: "Mörk", value: "dark" },
        ],
        layout: "radio",
      },
      initialValue: "white",
    }),
    defineField({
      name: "alignment",
      title: "Textjustering",
      type: "string",
      options: {
        list: [
          { title: "Vänster", value: "left" },
          { title: "Centrerad", value: "center" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "background" },
    prepare: ({ title, subtitle }) => ({
      title: `Text: ${title ?? "-"}`,
      subtitle: subtitle ?? "white",
    }),
  },
});
