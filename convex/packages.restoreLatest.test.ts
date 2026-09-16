import { describe, expect, it } from "vitest";
import { getPreferredRestoredPackageRelease } from "./packages";

function makeRelease(overrides: Record<string, unknown> = {}) {
  return {
    _id: "packageReleases:published",
    version: "1.0.0",
    createdAt: 10,
    softDeletedAt: undefined,
    ownerDeletedAt: undefined,
    publicationStatus: "published",
    ...overrides,
  };
}

describe("getPreferredRestoredPackageRelease", () => {
  it("does not promote an unpublished sibling after the published latest is gone", () => {
    const next = getPreferredRestoredPackageRelease("code-plugin", [
      makeRelease({
        _id: "packageReleases:pending",
        version: "2.0.0",
        createdAt: 20,
        publicationStatus: "pending",
      }) as never,
      makeRelease({
        _id: "packageReleases:published",
        version: "1.0.0",
        createdAt: 10,
        publicationStatus: "published",
        softDeletedAt: 99,
      }) as never,
    ]);

    expect(next).toBeNull();
  });

  it("keeps the highest published remaining release", () => {
    const next = getPreferredRestoredPackageRelease("code-plugin", [
      makeRelease({
        _id: "packageReleases:pending",
        version: "2.0.0",
        createdAt: 20,
        publicationStatus: "pending",
      }) as never,
      makeRelease({
        _id: "packageReleases:older",
        version: "1.0.0",
        createdAt: 10,
        publicationStatus: "published",
      }) as never,
    ]);

    expect(next?._id).toBe("packageReleases:older");
  });
});
