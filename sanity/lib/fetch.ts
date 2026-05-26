import type { QueryParams } from "next-sanity";
import { client } from "./client";

/**
 * Används enbart i Server Components och Server Actions — aldrig client-side.
 *
 * revalidate-värden:
 *   false / 300  → fallback ISR var 5:e minut; webhook är primär trigger
 *   60–300       → kortare periodisk ISR, bra för content som uppdateras ofta
 *
 * tags används för on-demand revalidation: revalidateTag(tag) i webhook-routen
 * triggar en ny fetch nästa gång sidan begärs.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate: revalidate === false ? 300 : revalidate, tags },
  });
}
