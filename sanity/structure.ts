import type { StructureResolver } from "sanity/structure";
import { apiVersion } from "./env";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Innehåll")

    .items([
      S.documentTypeListItem("page").title("Sidor"),

      S.divider(),
      S.divider(),

      S.documentTypeListItem("event").title("Händelser"),

      S.divider(),
      S.divider(),

      S.divider().title("Motiv"),

      S.listItem()
        .title("Inkommen")
        .child(
          S.documentTypeList("motiv")
            .title("Inkommen")
            .filter('_type == "motiv" && status == "inkommen"')
            .apiVersion(apiVersion),
        ),

      S.listItem()
        .title("Godkänd")
        .schemaType("motiv")
        .child(
          S.documentTypeList("motiv")
            .title("Godkänd")
            .schemaType("motiv")
            .filter('_type == "motiv" && status == "godkänd"')
            .apiVersion(apiVersion),
        ),

      S.listItem()
        .title("Nekad")
        .schemaType("motiv")
        .child(
          S.documentTypeList("motiv")
            .title("Nekad")
            .schemaType("motiv")
            .filter('_type == "motiv" && status == "nekad"')
            .apiVersion(apiVersion),
        ),

      S.divider(),
      S.divider(),

      S.listItem()
        .title("Webbplatsinställningar")
        .child(S.document().schemaType("settings").documentId("settings")),
    ]);
