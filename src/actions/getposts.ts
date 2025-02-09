"use server";

import db from "@/db/drizzle";
import { postVotes, problemPost, users } from "@/db/schema";
import { and, eq, gt, like, sql } from "drizzle-orm";
import s3Client from "@/storage/bucket";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { cache } from "react";

export const getPosts = cache(
  async ({
    pageParam,
    searchParam,
  }: {
    pageParam?: number;
    searchParam?: string;
  }) => {
    console.log("searchParam is:", searchParam);
    const res = await db
      .select({
        id: problemPost.id,
        title: problemPost.title,
        userId: problemPost.userId,
        postedBy: users.username,
        imgSrc: problemPost.imgSrcs,
        vidSrc: problemPost.vidSrc,
        contentFileType: problemPost.contentFileType,
        description: problemPost.description,
        createdAt: problemPost.createdAt,
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
      .where(
        and(
          searchParam && searchParam.length > 0
            ? like(problemPost.title, `%${searchParam}%`)
            : undefined,
          pageParam ? gt(problemPost.id, pageParam) : undefined
        )
      )
      .leftJoin(postVotes, eq(problemPost.id, postVotes.problemPostId))
      .leftJoin(users, eq(problemPost.userId, users.id))
      .groupBy(problemPost.id, problemPost.commentCount, users.username)
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
  }
);
