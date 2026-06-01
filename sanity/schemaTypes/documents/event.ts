import { defineField, defineType } from "sanity";

export const event = defineType({
  name: "event",
  title: "Händelse",
  type: "document",
  orderings: [
    {
      title: "Datum (nyast först)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Datum (äldst först)",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Datum",
      type: "date",
    }),
    defineField({
      name: "location",
      title: "Plats",
      type: "string",
      description: 'T.ex. "Medborgarplatsen 29, 118 26 Stockholm"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Beskrivning",
      type: "text",
      rows: 3,
      initialValue: "Kom och tryck ditt eget plakat inför valet.",
      validation: (Rule) =>
        Rule.required().max(100).error("Plats får inte överstiga 100 tecken"),
    }),
  ],
  preview: {
    select: { title: "title", date: "date" },
    prepare: ({ title, date }) => ({
      title,
      subtitle: date
        ? new Date(date as string).toLocaleDateString("sv-SE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
    }),
  },
});
