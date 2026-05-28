import { defineField, defineType } from "sanity";

export const motiveSubmission = defineType({
  name: "motiv",
  title: "Motiv",
  type: "document",
  orderings: [], // Excludes custom orderings, rely on default ordering
  fields: [
    defineField({
      name: "asset",
      title: "Bild",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Inkommna", value: "inkommen" },
          { title: "Godkända", value: "godkand" },
          { title: "Nekad", value: "nekad" },
        ],
        layout: "radio",
      },
      initialValue: "inkommen",
    }),
    defineField({
      name: "uploadedAt",
      title: "Uppladdad",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "isPublished",
      title: "Publicerad i galleri",
      type: "boolean",
      initialValue: false,
      validation: (rule) =>
        rule.custom((value, context) => {
          if (value && context.document?.status !== "godkänd") {
            return "Kan bara publiceras om status är godkänd";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      subtitle: "status",
      media: "asset",
      date: "uploadedAt",
      isPublished: "isPublished",
    },
    prepare: ({ subtitle, media, date, isPublished }) => ({
      title: date
        ? new Date(date as string).toLocaleString("sv-SE", {
            dateStyle: "short",
            timeStyle: "short",
          })
        : "Bidrag",
      subtitle:
        subtitle === "godkänd"
          ? `${subtitle}${isPublished ? " (publicerad)" : " (ej publicerad)"}`
          : subtitle,
      media,
    }),
  },
});
