import { LaunchIcon } from "@sanity/icons";
import { defineArrayMember, defineType } from "sanity";

const blockMembers = [
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
          fields: [
            { title: "URL", name: "href", type: "string" },
            { title: "Öppna i ny flik", name: "blank", type: "boolean" },
          ],
        },
      ],
    },
  }),
  defineArrayMember({
    type: "object",
    name: "button",
    title: "Knapp",
    icon: LaunchIcon,
    fields: [
      { name: "text", title: "Text", type: "string" },
      { name: "href", title: "URL", type: "string" },
      { name: "blank", title: "Öppna i ny flik", type: "boolean" },
      {
        name: "variant",
        title: "Utseende",
        type: "string",
        options: {
          list: [
            { title: "Standard", value: "primary", default: true },
            { title: "Accent", value: "accent" },
            { title: "Outline", value: "outline" },
          ],
        },
      },
    ],
  }),
];

export const blockContent = defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    ...blockMembers,
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      title: "Bild",
    }),
  ],
});

export const simpleBlockContent = defineType({
  name: "simpleBlockContent",
  title: "Simple Block Content",
  type: "array",
  of: [...blockMembers],
});
