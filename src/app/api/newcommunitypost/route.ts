import db from "@/db/drizzle";
import { community, communityPosts, problemPost } from "@/db/schema";
import s3Client from "@/storage/bucket";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { z } from "zod";

const communityPostSchema = z.object({
  title: z.string(),
  description: z.string(),
  file: z.any(),
  tags: z.array(z.string()),
  communityName: z.string(),
  userId: z.number(),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const userId = Number(formData.get("userId")) as number;
  const communityName = formData.get("communityName") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const file = formData.get("file") as File;
  const tagString = formData.get("tags") as string;
  const tags = tagString.split("#").filter((tag) => tag.length > 0);
  const data = { userId, communityName, title, description, file, tags };

  const parsedData = communityPostSchema.safeParse(data);

  if (!parsedData.success) {
    return Response.json(
      { message: "error", err: parsedData.error },
      { status: 400 }
    );
  }

  const now = new Date();

  const communityId = await db
    .select({ id: community.id })
    .from(community)
    .where(eq(community.title, parsedData.data.communityName))
    .limit(1);

  if (communityId.length === 0) {
    return Response.json(
      { message: "error", err: "Community does not exist" },
      { status: 400 }
    );
  }

  try {
    if (parsedData.data.file.name) {
      uploadImageFile(parsedData.data.file, userId);
      parsedData.data.file = [
        `postimages/${userId}/${parsedData.data.file.name}`,
      ];
    } else {
      parsedData.data.file = null;
    }
    await db.transaction(async (tx) => {
      const res = await tx
        .insert(problemPost)
        .values({
          title: parsedData.data.title,
          description: parsedData.data.description,
          tags: parsedData.data.tags,
          userId: parsedData.data.userId,
          imgSrcs: parsedData.data.file,
          commentCount: 0,
          createdAt: now,
          contentFileType: parsedData.data.file ? "image" : null,
          vidSrc: null,
        })
        .returning({ id: problemPost.id });

      await tx.insert(communityPosts).values({
        problemPostId: res[0].id,
        userId: parsedData.data.userId,
        communityId: communityId[0].id,
        createdAt: now,
      });
    });
  } catch (err) {
    return Response.json({ message: "error", err }, { status: 500 });
  }

  return Response.json({ message: "success" }, { status: 200 });
}

async function uploadImageFile(file: File, userId: number) {
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const params = {
    Bucket: "postimages",
    Key: `${userId}/${file.name}`,
    Body: fileBuffer,
    ContentType: file.type,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
  } catch (err) {
    console.log(err);
  }
}
