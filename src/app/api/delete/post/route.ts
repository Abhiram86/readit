import db from "@/db/drizzle";
import { communityPosts, problemPost } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const deletePostSchema = z.object({
  userId: z.number(),
  postId: z.number(),
});

export async function DELETE(request: Request) {
  const body = await request.json();

  const parsed = deletePostSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { message: "error", err: parsed.error },
      { status: 400 }
    );
  }

  try {
    await db.transaction(async (tx) => {
      const isCommunityPost = await tx
        .select()
        .from(communityPosts)
        .where(eq(communityPosts.problemPostId, parsed.data.postId))
        .limit(1);
      await tx
        .delete(problemPost)
        .where(
          and(
            eq(problemPost.id, parsed.data.postId),
            eq(problemPost.userId, parsed.data.userId)
          )
        );
      if (isCommunityPost.length > 0) {
        await tx
          .delete(communityPosts)
          .where(eq(communityPosts.problemPostId, parsed.data.postId));
      }
    });
  } catch (error) {
    return Response.json({ message: "error", err: error }, { status: 500 });
  }
  return Response.json({ message: "success" }, { status: 200 });
}
