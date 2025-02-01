import db from "@/db/drizzle";
import { comments, commentVotes, postVotes, problemPost } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import s3Client from "@/storage/bucket";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getPost(id: number) {
  const res = await db
    .select({
      id: problemPost.id,
      title: problemPost.title,
      postedBy: problemPost.userId,
      imgSrc: problemPost.imgSrcs,
      vidSrc: problemPost.vidSrc,
      contentFileType: problemPost.contentFileType,
      description: problemPost.description,
      stats: {
        upvotes:
          sql<number>`COUNT(CASE WHEN ${postVotes.voteType} = TRUE THEN 1 END)`.as(
            "upvotes"
          ),
        downvotes:
          sql<number>`COUNT(CASE WHEN ${postVotes.voteType} = FALSE THEN 1 END)`.as(
            "downvotes"
          ),
        comments: problemPost.commentCount,
      },
    })
    .from(problemPost)
    .leftJoin(postVotes, eq(problemPost.id, postVotes.problemPostId))
    .where(eq(problemPost.id, id))
    .groupBy(problemPost.id, problemPost.commentCount);

  if (res[0].imgSrc) {
    const signedUrl = await generateSignedUrl(
      res[0].imgSrc[0].split("/")[0],
      res[0].imgSrc[0].split("/").slice(1).join("/")
    );
    res[0].imgSrc = [signedUrl];
  }

  return res[0];
}

const generateSignedUrl = async (bucket: string, key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  return url;
};

export async function getComments(id: number) {
  const res = await db
    .select({
      id: comments.id,
      content: comments.content,
      postedBy: comments.userId,
      time: comments.createdAt,
      text: comments.content,
      parentId: comments.parentCommentId,
      level: comments.level,
      upvotes:
        sql<number>`COUNT(CASE WHEN ${commentVotes.voteType} = TRUE THEN 1 END)`.as(
          "upvotes"
        ),
      downvotes:
        sql<number>`COUNT(CASE WHEN ${commentVotes.voteType} = FALSE THEN 1 END)`.as(
          "downvotes"
        ),
      replies: comments.commentCount,
    })
    .from(comments)
    .leftJoin(commentVotes, eq(comments.id, commentVotes.commentId))
    .where(and(eq(comments.problemPostId, id), eq(comments.level, 1)))
    .groupBy(comments.id, comments.commentCount)
    .orderBy(desc(comments.createdAt));
  return res;
}

export async function getPostWithComments(id: number) {
  const res = Promise.allSettled([getPost(id), getComments(id)]);
  return res;
}
