import { defineField, defineType } from "sanity";

export const settings = defineType({
  name: "settings",
  title: "Webbplatsinställningar",
  type: "document",
  groups: [
    { name: "seo", title: "SEO", default: true },
    { name: "footer", title: "Footer" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      hidden: true,
      initialValue: "Webbplatsinställningar",
      group: "seo",
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      group: "seo",
    }),
    defineField({
      name: "footerText",
      title: "Footer-text",
      type: "text",
      group: "footer",
      description: "Kort text eller tagline som visas i footern.",
    }),
  ],
  preview: {
    select: { title: "seoTitle" },
    prepare: () => ({ title: "Webbplatsinställningar" }),
  },
});
