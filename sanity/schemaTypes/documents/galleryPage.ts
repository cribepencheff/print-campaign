import { defineField, defineType } from "sanity";

export const galleryPage = defineType({
  name: "galleryPage",
  title: "Galleri",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-segmentet för gallerisidan, t.ex. /galleri",
      options: { source: "title" },
      initialValue: { current: "galleri" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      type: "simpleBlockContent",
    }),
    defineField({
      name: "images",
      title: "Bilder",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              title: "Alt text",
              type: "string",
            },
            {
              name: "caption",
              title: "Caption",
              type: "string",
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { subtitle: "slug.current" },
    prepare: ({ subtitle }) => ({
      title: "Folkets tryck",
      subtitle: subtitle ? `/${subtitle}` : "/galleri",
    }),
  },
});
