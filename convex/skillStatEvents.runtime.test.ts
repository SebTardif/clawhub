/// <reference types="vite/client" />
/* @vitest-environment edge-runtime */
import { convexTest } from "convex-test";
import { expect, it } from "vitest";
import { internal } from "./_generated/api";
import schema from "./schema";

const modules = import.meta.glob("./**/*.ts");

async function seedSkill(t: ReturnType<typeof convexTest>) {
  return await t.run(async (ctx) => {
    const ownerUserId = await ctx.db.insert("users", { handle: "stat-cursor-owner" });
    return await ctx.db.insert("skills", {
      slug: "stat-cursor",
      displayName: "Stat cursor",
      ownerUserId,
      tags: {},
      stats: { comments: 0, downloads: 0, stars: 0, versions: 0 },
      createdAt: 1,
      updatedAt: 1,
    });
  });
}

it("drops the partial page cursor once that creation-time range is finished", async () => {
  const t = convexTest(schema, modules);
  const skillId = await seedSkill(t);
  await t.run(async (ctx) => {
    await ctx.db.insert("skillStatUpdateCursors", {
      key: "skill_stat_events",
      cursorCreationTime: 10,
      paginationCursor: "page-2",
      paginationLowerBound: 10,
      updatedAt: 1,
    });
  });

  await t.mutation(internal.skillStatEvents.applyAggregatedStatsAndUpdateCursor, {
    skillDeltas: [
      {
        skillId,
        downloads: 0,
        stars: 0,
        installsAllTime: 1,
        installsCurrent: 1,
        downloadEvents: [],
        installNewEvents: [20],
      },
    ],
    newCursor: 30,
    clearPaginationCursor: true,
  });

  const cursor = await t.run(async (ctx) => {
    return await ctx.db
      .query("skillStatUpdateCursors")
      .withIndex("by_key", (q) => q.eq("key", "skill_stat_events"))
      .unique();
  });
  expect(cursor?.cursorCreationTime).toBe(30);
  expect(cursor?.paginationCursor).toBeUndefined();
  expect(cursor?.paginationLowerBound).toBeUndefined();
});
