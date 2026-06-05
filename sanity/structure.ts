import {
  Files,
  Images,
  CalendarDays,
  SettingsIcon,
  CircleDashedIcon,
  CircleMinusIcon,
  SmileIcon,
} from "lucide-react";
import type { StructureResolver } from "sanity/structure";
import { apiVersion } from "./env";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Innehåll")

    .items([
      S.documentTypeListItem("page").title("Sidor").icon(Files),

      S.listItem()
        .title("Gallerisida")
        .icon(Images)
        .child(
          S.document().schemaType("galleryPage").documentId("galleryPage")
        ),

      S.documentTypeListItem("event").title("Händelser").icon(CalendarDays),

      S.divider(),

      S.listItem()
        .title("Motiv / Inkomna")
        .icon(CircleDashedIcon)
        .child(
          S.documentTypeList("motiv")
            .title("Motiv / Inkomna")
            .filter('_type == "motiv" && status == $status')
            .params({ status: "pending" })
            .apiVersion(apiVersion)
        ),
      S.listItem()
        .title("Motiv / Godkända")
        .icon(SmileIcon)
        .child(
          S.documentTypeList("motiv")
            .title("Motiv / Godkända")
            .filter('_type == "motiv" && status == $status')
            .params({ status: "approved" })
            .apiVersion(apiVersion)
        ),
      S.listItem()
        .title("Motiv / Nekad")
        .icon(CircleMinusIcon)
        .child(
          S.documentTypeList("motiv")
            .title("Motiv / Nekad")
            .filter('_type == "motiv" && status == $status')
            .params({ status: "rejected" })
            .apiVersion(apiVersion)
        ),

      S.divider(),

      S.listItem()
        .title("Inställningar")
        .icon(SettingsIcon)
        .child(S.document().schemaType("settings").documentId("settings")),
    ]);
