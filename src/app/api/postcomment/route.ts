import db from "@/db/drizzle";
import { comments, problemPost } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const commentSchema = z.object({
  userId: z.number(),
  problemPostId: z.number(),
  comment: z.string(),
  level: z.number(),
  parentCommentId: z.number().optional(),
});

export async function POST(request: Request) {
  const data = await request.json();

  const parsed = commentSchema.safeParse(data);

  if (!parsed.success) {
    console.log(data);
    return new Response(parsed.error.message, { status: 400 });
  }

  const { userId, problemPostId, comment, level, parentCommentId } =
    parsed.data;

  try {
    await db.transaction(async (tx) => {
      await tx.insert(comments).values({
        userId,
        problemPostId,
        content: comment,
        commentCount: 0,
        level: level + 1,
        isDeleted: false,
        createdAt: new Date(),
        parentCommentId: parentCommentId ? parentCommentId : null,
      });
      if (parentCommentId)
        await tx
          .update(comments)
          .set({ commentCount: sql`comment_count + 1` })
          .where(eq(comments.id, parentCommentId));
      await tx
        .update(problemPost)
        .set({ commentCount: sql`${problemPost.commentCount} + 1` })
        .where(eq(problemPost.id, problemPostId));
    });
    revalidatePath(`/problem/${problemPostId}`);
  } catch (error) {
    console.error(error);
    return new Response("error", { status: 500 });
  }

  return new Response("success", { status: 200 });
}
