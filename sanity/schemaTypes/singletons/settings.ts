import { defineField, defineType } from "sanity";

export const settings = defineType({
  name: "settings",
  title: "Inställningar",
  type: "document",
  fields: [
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
    }),
  ],
  preview: {
    select: { title: "siteTitle" },
    prepare: () => ({ title: "Inställningar" }),
  },
});
