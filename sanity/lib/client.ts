import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

// Toggle Sanity CDN usage for cached vs fresh data
const useCdn = process.env.NEXT_PUBLIC_SANITY_USE_CDN === "true";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});
