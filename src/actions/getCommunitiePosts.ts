"use server";

import db from "@/db/drizzle";
import {
  community,
  communityPosts,
  postVotes,
  problemPost,
  users,
} from "@/db/schema";
import s3Client from "@/storage/bucket";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { eq, sql } from "drizzle-orm";
import { cache } from "react";

export const getCommunitiePosts = cache(
  async (communityName: string, userId: number) => {
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
        isSaved:
          sql<boolean>`EXISTS (SELECT 1 FROM saved_posts WHERE problem_post_id = ${problemPost.id} AND user_id = ${userId})`.as(
            "isSaved"
          ),
        isVoted: userId
          ? sql<boolean | null>`
                      (SELECT ${postVotes.voteType} 
               FROM ${postVotes} 
               WHERE ${postVotes.problemPostId} = ${problemPost.id} 
               AND ${postVotes.userId} = ${userId} 
               LIMIT 1)
        
                    `.as("isVoted")
          : sql<boolean | null>`NULL`.as("isVoted"),
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
      .leftJoin(
        communityPosts,
        eq(problemPost.id, communityPosts.problemPostId)
      )
      .leftJoin(users, eq(problemPost.userId, users.id))
      .leftJoin(postVotes, eq(problemPost.id, postVotes.problemPostId))
      .where(eq(community.title, communityName))
      .leftJoin(community, eq(communityPosts.communityId, community.id))
      .groupBy(community.id, problemPost.id, users.id);

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
