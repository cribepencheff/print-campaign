"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { svSELocale } from "@sanity/locale-sv-se";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import { deleteMotivWithAsset } from "./sanity/actions/deleteMotivWithAsset";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    media(),
    svSELocale(),
  ],
  document: {
    // För "motiveSubmission": ersätt standard-Delete med en variant som även
    // städar bort bild-asseten om den blir orefererad. Övriga dokumenttyper
    // är opåverkade.
    actions: (prev, context) =>
      context.schemaType === "motiveSubmission"
        ? [
            deleteMotivWithAsset,
            ...prev.filter((action) => action.action !== "delete"),
          ]
        : prev,
  },
});
