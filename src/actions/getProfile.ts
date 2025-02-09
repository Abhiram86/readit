"use server";

import { ImageProblemProps } from "@/components/ImageProblemPost";
import db from "@/db/drizzle";
import {
  comments,
  commentVotes,
  postVotes,
  problemPost,
  savedPosts,
  users,
} from "@/db/schema";
import s3Client from "@/storage/bucket";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, desc, eq, sql } from "drizzle-orm";
import { cache } from "react";

export default async function getBasicProfile(id: number) {
  const profileData = await db
    .select({
      id: users.id,
      name: users.username,
      email: users.email,
      createdAt: users.createdAt,
      posts: sql<number>`(COUNT(DISTINCT ${problemPost.id}))`.as("posts"),
      comments: sql<number>`(COUNT(DISTINCT ${comments.id}))`.as("comments"),
    })
    .from(users)
    .leftJoin(problemPost, eq(users.id, problemPost.userId))
    .leftJoin(comments, eq(users.id, comments.userId))
    .where(eq(users.id, id))
    .groupBy(users.id)
    .limit(1);
  return profileData[0];
}

export async function getMyPosts(id: number) {
  const myPosts = await db
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
    .where(eq(problemPost.userId, id))
    .orderBy(desc(problemPost.id))
    .groupBy(problemPost.id, problemPost.commentCount);

  const posts = await getPostsWithSingedUrl(myPosts);

  return posts;
}

async function getPostsWithSingedUrl(posts: ImageProblemProps["data"][]) {
  for (let i = 0; i < posts.length; i++) {
    const image = posts[i].imgSrc;
    if (image) {
      const signedUrl = await generateSignedUrl(
        image[0].split("/")[0],
        image[0].split("/").slice(1).join("/")
      );
      posts[i].imgSrc = [signedUrl];
    }
  }
  return posts;
}

async function generateSignedUrl(bucket: string, key: string) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });
  return signedUrl;
}

export async function getMyVotedPosts(id: number, voteType: boolean) {
  const upvotedPosts = await db
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
    .where(and(eq(postVotes.userId, id), eq(postVotes.voteType, voteType)))
    .groupBy(problemPost.id);

  const posts = getPostsWithSingedUrl(upvotedPosts);

  return posts;
}

export async function getMyComments(id: number) {
  const myComments = await db
    .select({
      id: comments.id,
      problemPostId: comments.problemPostId,
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
    .where(eq(comments.userId, id))
    .groupBy(comments.id, comments.commentCount)
    .orderBy(desc(comments.createdAt));
  return myComments;
}

export const getMySavedPosts = cache(async (id: number) => {
  const mySavedPosts = await db
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
    .leftJoin(savedPosts, eq(savedPosts.problemPostId, problemPost.id))
    .leftJoin(postVotes, eq(postVotes.problemPostId, problemPost.id))
    .where(eq(savedPosts.userId, id))
    .groupBy(problemPost.id);

  const posts = getPostsWithSingedUrl(mySavedPosts);

  return posts;
});
