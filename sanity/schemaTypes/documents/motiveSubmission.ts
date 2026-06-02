import { defineField, defineType } from "sanity";

export const motiveSubmission = defineType({
  name: "motiv",
  title: "Motiv",
  type: "document",
  orderings: [
    {
      title: "Not Published (Desc)",
      name: "notPublishedFirst",
      by: [{ field: "isPublished", direction: "asc" }],
    },
  ],
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
      hidden: ({ document }) => document?.status !== "approved",
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
    prepare: ({ subtitle, media, date, isPublished }) => {
      const formattedDate = date
        ? new Date(date as string).toLocaleString("sv-SE", {
            dateStyle: "short",
            timeStyle: "short",
          })
        : "Unknown date";

      return {
        title: `${isPublished ? "✅ " : ""}${formattedDate}`,
        subtitle:
          subtitle === "approved"
            ? `Godkänd${isPublished ? " (publicerad)" : " (ej publicerad)"}`
            : "",
        media,
      };
    },
  },
});
