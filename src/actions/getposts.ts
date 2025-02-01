"use server";

import db from "@/db/drizzle";
import { postVotes, problemPost } from "@/db/schema";
import { eq, gt, sql } from "drizzle-orm";
import s3Client from "@/storage/bucket";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { cache } from "react";

export const getPosts = cache(async ({ pageParam }: { pageParam?: number }) => {
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
    .where(pageParam ? gt(problemPost.id, pageParam) : undefined)
    .leftJoin(postVotes, eq(problemPost.id, postVotes.problemPostId))
    .groupBy(problemPost.id, problemPost.commentCount)
    .orderBy(problemPost.id)
    .limit(2);

  const postsWithFiles = await Promise.all(
    res.map(async (post) => {
      const signedUrls = await Promise.all(
        (post.imgSrc || []).map(async (imgSrc) => {
          try {
            const bucket = imgSrc.split("/")[0];
            const key = imgSrc.split("/").slice(1).join("/");
            const command = new GetObjectCommand({
              Bucket: bucket,
              Key: key,
            });
            const signedUrl = await getSignedUrl(s3Client, command, {
              expiresIn: 300,
            });
            return signedUrl;
          } catch (error) {
            console.error(
              `Error generating pre-signed URL for ${imgSrc}:`,
              error
            );
            return null;
          }
        })
      );

      return {
        ...post,
        imgSrc: signedUrls.filter((url) => url !== null),
      };
    })
  );

  return postsWithFiles;
});
