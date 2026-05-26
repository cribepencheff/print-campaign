import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Bild",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt-text", type: "string" })],
    }),
    defineField({
      name: "cta",
      title: "CTA-knapp",
      type: "object",
      fields: [
        defineField({ name: "text", title: "Text", type: "string" }),
        defineField({ name: "url", title: "URL", type: "string" }),
      ],
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Centrerad", value: "centered" },
          { title: "Delad — text vänster, bild höger", value: "split" },
        ],
        layout: "radio",
      },
      initialValue: "centered",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "layout" },
    prepare: ({ title, subtitle }) => ({
      title: `Hero: ${title ?? "–"}`,
      subtitle: subtitle === "split" ? "Delad layout" : "Centrerad layout",
    }),
  },
});
