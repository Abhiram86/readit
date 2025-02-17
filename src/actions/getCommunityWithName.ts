"use server";

import db from "@/db/drizzle";
import { community, communityMembers } from "@/db/schema";
import s3Client from "@/storage/bucket";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { eq, sql } from "drizzle-orm";
import { cache } from "react";

export const getCommunityWithName = cache(async (name: string) => {
  const res = await db
    .select({
      id: community.id,
      name: community.title,
      banner: community.banner,
      createdAt: community.createdAt,
      description: community.description,
      membersCount: sql<number>`COUNT(DISTINCT${communityMembers.userId})`.as(
        "membersCount"
      ),
    })
    .from(community)
    .leftJoin(communityMembers, eq(community.id, communityMembers.communityId))
    .where(eq(community.title, name))
    .groupBy(community.id);
  if (res.length !== 0 && res[0].banner !== null) {
    const url = await generateSignedUrl(
      res[0].banner.split("/")[0],
      `${res[0].banner.split("/").slice(1).join("/")}`
    );
    res[0].banner = url;
    // console.log(url);
  }
  return res;
});

const generateSignedUrl = async (bucket: string, key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300,
  });
  return signedUrl;
};
