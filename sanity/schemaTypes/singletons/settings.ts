import { defineField, defineType } from "sanity";

export const settings = defineType({
  name: "settings",
  title: "Inställningar",
  type: "document",
  groups: [
    { name: "footer", title: "Footer", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      hidden: true,
      initialValue: "Inställningar",
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
    prepare: () => ({ title: "Inställningar" }),
  },
});
