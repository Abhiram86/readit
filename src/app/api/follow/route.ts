import { z } from "zod";
import db from "@/db/drizzle";
import { followers } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const followSchema = z.object({
  followerId: z.number(),
  userId: z.number(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = followSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(parsed.error.message, { status: 400 });
  }
  const isFollowing = await db
    .select()
    .from(followers)
    .where(
      and(
        eq(followers.followerId, parsed.data.followerId),
        eq(followers.userId, parsed.data.userId)
      )
    )
    .limit(1);
  if (isFollowing.length > 0) {
    await db
      .delete(followers)
      .where(
        and(
          eq(followers.followerId, parsed.data.followerId),
          eq(followers.userId, parsed.data.userId)
        )
      );
    return Response.json({ message: "unfollowed" }, { status: 200 });
  }
  await db.insert(followers).values(parsed.data);
  return Response.json({ message: "following" }, { status: 200 });
}
