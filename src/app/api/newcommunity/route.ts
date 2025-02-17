import { z } from "zod";
import db from "@/db/drizzle";
import { community, communityMembers } from "@/db/schema";
import s3Client from "@/storage/bucket";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const communitySchema = z.object({
  createdBy: z.number(),
  title: z.string().min(3),
  description: z.string().min(3),
  avatar: z.any(),
  banner: z.any(),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const createdBy = Number(formData.get("userId"));
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const avatar = formData.get("avatar") as File;
  const banner = formData.get("banner") as File;
  const data = { createdBy, title, description, avatar, banner };

  const result = communitySchema.safeParse(data);

  if (!result.success) {
    return Response.json(
      { message: "error", err: result.error },
      { status: 400 }
    );
  }

  const now = new Date();

  const params = {
    Bucket: "postimages",
    Key: `${data.title}/${banner.name}`,
    Body: Buffer.from(await banner.arrayBuffer()),
    ContentType: banner.type,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    try {
      await db.transaction(async (tx) => {
        const communityId = await tx
          .insert(community)
          .values({
            ...result.data,
            avatar: null,
            banner: `postimages/${data.title}/${banner.name}`,
            createdAt: now,
          })
          .returning({ id: community.id });
        await tx.insert(communityMembers).values({
          communityId: communityId[0].id,
          userId: createdBy,
          joinedAt: now,
        });
      });
    } catch (error) {
      return Response.json({ message: "error", err: error }, { status: 500 });
    }
  } catch (err) {
    console.log("uploading file error in new community creation", err);
  }
  return Response.json({ message: "success" }, { status: 200 });
}
