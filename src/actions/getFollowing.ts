"use server";

import db from "@/db/drizzle";
import { followers, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getFollowing(id: number) {
  const following = await db
    .select({
      id: followers.followerId,
      name: users.username,
    })
    .from(followers)
    .leftJoin(users, eq(followers.followerId, users.id))
    .where(eq(followers.userId, id))
    .groupBy(followers.followerId, users.id);

  return following;
}
