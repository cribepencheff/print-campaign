import {
  getAssetId,
  getBaseId,
  shouldDeleteAsset,
} from "@/sanity/actions/deleteMotivWithAsset.logic";

describe("getBaseId", () => {
  it("strips the drafts. prefix when present", () => {
    expect(getBaseId("drafts.abc123")).toBe("abc123");
  });

  it("returns the id unchanged when no drafts. prefix", () => {
    expect(getBaseId("abc123")).toBe("abc123");
  });
});

describe("getAssetId", () => {
  it("returns the asset ref when present", () => {
    const doc = { asset: { asset: { _ref: "image-abc-100x100-png" } } };
    expect(getAssetId(doc)).toBe("image-abc-100x100-png");
  });

  it("returns undefined when doc is undefined", () => {
    expect(getAssetId(undefined)).toBeUndefined();
  });

  it("returns undefined when asset field is missing", () => {
    expect(getAssetId({})).toBeUndefined();
  });

  it("returns undefined when asset ref is missing", () => {
    const doc = { asset: { asset: {} } };
    expect(getAssetId(doc)).toBeUndefined();
  });
});

describe("shouldDeleteAsset", () => {
  it("returns true when there are no referencing documents", () => {
    expect(shouldDeleteAsset(0)).toBe(true);
  });

  it("returns false when at least one document still references the asset", () => {
    expect(shouldDeleteAsset(1)).toBe(false);
  });
});
