import { defineArrayMember, defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Citat", value: "blockquote" },
      ],
      lists: [
        { title: "Punktlista", value: "bullet" },
        { title: "Numrerad lista", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Fetstil", value: "strong" },
          { title: "Kursiv", value: "em" },
        ],
        annotations: [
          {
            title: "Länk",
            name: "link",
            type: "object",
            fields: [{ title: "URL", name: "href", type: "url" }],
          },
        ],
      },
    }),
    defineArrayMember({ type: "image", options: { hotspot: true } }),
  ],
});
