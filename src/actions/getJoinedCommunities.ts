"use server";

import db from "@/db/drizzle";
import { community, communityMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getCommunities = cache(async (userid: number) => {
  const res = await db
    .select({
      id: community.id,
      name: community.title,
    })
    .from(community)
    .leftJoin(communityMembers, eq(community.id, communityMembers.communityId))
    .where(eq(communityMembers.userId, userid))
    .groupBy(community.id);
  return res;
});
