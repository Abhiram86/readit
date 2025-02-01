import db from "@/db/drizzle";
import { commentVotes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const commentVoteSchema = z.object({
  commentId: z.number(),
  userId: z.number(),
  type: z.enum(["upvote", "downvote"]),
});

export async function POST(request: Request) {
  const data = await request.json();

  const parsed = commentVoteSchema.safeParse(data);

  if (!parsed.success) {
    return new Response(parsed.error.message, { status: 400 });
  }

  const { commentId, userId, type } = parsed.data;

  const existingVote = await db
    .select()
    .from(commentVotes)
    .where(
      and(
        eq(commentVotes.commentId, commentId),
        eq(commentVotes.userId, userId)
      )
    )
    .limit(1);

  if (existingVote.length > 0) {
    await db
      .delete(commentVotes)
      .where(
        and(
          eq(commentVotes.commentId, commentId),
          eq(commentVotes.userId, userId)
        )
      );
    return Response.json({ message: "vote removed" }, { status: 200 });
  }
  const vote = await db
    .insert(commentVotes)
    .values({
      commentId,
      userId,
      voteType: type === "upvote",
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [commentVotes.commentId, commentVotes.userId],
      set: { voteType: type === "upvote" },
      where: eq(commentVotes.voteType, type !== "upvote"),
    });

  if (vote) {
    return Response.json({ message: "vote added" }, { status: 200 });
  }

  return Response.json(
    {
      message: "error adding vote",
    },
    { status: 400 }
  );
}
