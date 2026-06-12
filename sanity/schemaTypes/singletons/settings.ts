import { defineArrayMember, defineField, defineType } from "sanity";

export const settings = defineType({
  name: "settings",
  title: "Inställningar",
  type: "document",
  groups: [
    { name: "navigation", title: "Navigation", default: true },
    { name: "footer", title: "Footer" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "navigationLinks",
      title: "Navigationslänkar",
      type: "array",
      group: "navigation",
      of: [
        defineArrayMember({
          type: "object",
          name: "navLink",
          fields: [
            defineField({
              name: "label",
              title: "Text",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "linkType",
              title: "Länktyp",
              type: "string",
              initialValue: "intern",
              options: {
                list: [
                  { title: "Intern sida", value: "intern" },
                  { title: "Anpassad länk", value: "extern" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: "internalLink",
              title: "Sida",
              type: "reference",
              to: [{ type: "page" }, { type: "galleryPage" }],
              hidden: ({ parent }) => parent?.linkType !== "intern",
              validation: (r) =>
                r.custom((value, ctx) => {
                  if ((ctx.parent as { linkType?: string })?.linkType === "intern" && !value) {
                    return "Välj en sida";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "externalUrl",
              title: "Länk",
              type: "string",
              description: 'T.ex. "https://example.com", "#sektion" eller "/annan-sida"',
              hidden: ({ parent }) => parent?.linkType !== "extern",
              validation: (r) =>
                r.custom((value, ctx) => {
                  if ((ctx.parent as { linkType?: string })?.linkType !== "extern") return true;
                  if (!value) return "Ange en länk";
                  const isValid =
                    value.startsWith("http://") ||
                    value.startsWith("https://") ||
                    value.startsWith("#") ||
                    value.startsWith("/");
                  return isValid || 'Länken måste börja med "https://", "#" eller "/"';
                }),
            }),
          ],
          preview: {
            select: {
              title: "label",
              linkType: "linkType",
              slug: "internalLink.slug.current",
              externalUrl: "externalUrl",
            },
            prepare: ({ title, linkType, slug, externalUrl }) => ({
              title,
              subtitle: linkType === "intern" ? `/${slug ?? ""}` : externalUrl,
            }),
          },
        }),
      ],
    }),
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
