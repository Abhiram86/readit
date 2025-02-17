"use server";

import db from "@/db/drizzle";
import { followers } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export default async function getIsFollowing(
  followerId: number,
  userId: number
) {
  const isFollowing = await db
    .select({
      follwingId: followers.id,
    })
    .from(followers)
    .where(
      and(eq(followers.followerId, followerId), eq(followers.userId, userId))
    )
    .limit(1);
  console.log("following data is", isFollowing);

  return { isFollowing: isFollowing.length > 0 };
}
