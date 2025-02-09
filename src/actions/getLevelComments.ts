"use server";

import db from "@/db/drizzle";
import { comments, commentVotes } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function getLevelComments(problemPostId: number, level: number) {
  const res = await db
    .select({
      id: comments.id,
      content: comments.content,
      postedBy: comments.userId,
      time: comments.createdAt,
      text: comments.content,
      parentId: comments.parentCommentId,
      level: comments.level,
      replies: comments.commentCount,
      upvotes:
        sql<number>`COUNT(CASE WHEN ${commentVotes.voteType} = TRUE THEN 1 END)`.as(
          "upvotes"
        ),
      downvotes:
        sql<number>`COUNT(CASE WHEN ${commentVotes.voteType} = FALSE THEN 1 END)`.as(
          "downvotes"
        ),
    })
    .from(comments)
    .where(
      and(eq(comments.problemPostId, problemPostId), eq(comments.level, level))
    )
    .leftJoin(commentVotes, eq(comments.id, commentVotes.commentId))
    .groupBy(comments.id, comments.commentCount);

  return res;
}
