export function getBaseId(id: string): string {
  return id.startsWith("drafts.") ? id.slice("drafts.".length) : id;
}

export const VERSION_IDS_QUERY =
  '*[_id in path("drafts." + $baseId) || _id in path("versions.*." + $baseId)]._id';

export const REFERENCING_DOCS_QUERY = "count(*[references($assetId)])";

export function getAssetId(
  doc: { asset?: { asset?: { _ref?: string } } } | undefined,
): string | undefined {
  return doc?.asset?.asset?._ref;
}

export function shouldDeleteAsset(referencingDocs: number): boolean {
  return referencingDocs === 0;
}
