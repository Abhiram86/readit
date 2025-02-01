import db from "@/db/drizzle";
import { postVotes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const voteSchema = z.object({
  problemPostId: z.number(),
  userId: z.number(),
  type: z.enum(["upvote", "downvote"]),
});

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = voteSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(parsed.error.message, { status: 400 });
  }

  const { problemPostId, userId, type } = parsed.data;

  const vote = await db
    .select()
    .from(postVotes)
    .where(
      and(
        eq(postVotes.problemPostId, problemPostId),
        eq(postVotes.userId, userId)
      )
    )
    .limit(1);

  if (vote.length > 0 && vote[0].voteType === (type === "upvote")) {
    await db
      .delete(postVotes)
      .where(
        and(
          eq(postVotes.problemPostId, problemPostId),
          eq(postVotes.userId, userId)
        )
      );
    return Response.json(
      {
        message: "vote removed",
      },
      { status: 200 }
    );
  }

  await db
    .insert(postVotes)
    .values({
      userId,
      voteType: type === "upvote",
      problemPostId,
      createdAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [postVotes.problemPostId, postVotes.userId],
      set: { voteType: type === "upvote" },
      where: eq(postVotes.voteType, type !== "upvote"),
    });

  return Response.json(
    {
      message: "vote added",
    },
    { status: 200 }
  );
}
