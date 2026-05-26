import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "settings",
      ),

      S.divider(),

      S.listItem()
        .title("Settings")
        .child(S.document().schemaType("settings").documentId("settings")),
    ]);
