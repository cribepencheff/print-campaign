import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Rubrik",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      type: "simpleBlockContent",
    }),
    defineField({
      name: "image",
      title: "Hero bild",
      description:
        "Rekommenderat format: JPG eller PNG, minst 1440x810 px, max 5 MB. Använd fokuspunkten (⊕) för att styra vilket område som alltid syns vid beskärning.",
      type: "image",
      options: { hotspot: true, accept: "image/jpeg,image/png,image/gif" },
      fields: [defineField({ name: "alt", title: "Alt-text", type: "string" })],
    }),
  ],
  preview: {
    select: { title: "heading", media: "image" },
    prepare: ({ title, media }) => ({
      title: `Hero: ${title ?? "-"}`,
      media,
    }),
  },
});
