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
          { title: "Inkommen", value: "pending" },
          { title: "Godkänd", value: "approved" },
          { title: "Nekad", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
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
          if (value && context.document?.status !== "approved") {
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
        subtitle === "approved"
          ? `Godkänd${isPublished ? " (publicerad)" : " (ej publicerad)"}`
          : "", // UUID in a near future, but for now just show status if approved
      media,
    }),
  },
});
