import db from "@/db/drizzle";
import { problemPost } from "@/db/schema";
import s3Client from "@/storage/bucket";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";
// import ffmpeg from "fluent-ffmpeg";
// import stream from "stream";

const postSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const userId = formData.get("userId") as string;
  const title = formData.get("title") as string;
  const tagString = formData.get("tags") as string;
  const file = formData.get("file") as File;
  const description = formData.get("description") as string;

  const tags = tagString.split("#").filter((tag) => tag.length > 0);

  const result = postSchema.safeParse({ title, description, tags });

  if (!result.success) {
    return Response.json(
      { message: "error", err: result.error },
      { status: 400 }
    );
  }

  let imgSrc = null;
  let vidSrc = null;
  let contentFileType = null;

  if (file.name) {
    if (
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png" ||
      file.type === "image/gif"
    ) {
      imgSrc = `postimages/${userId}/${file.name}`;
      contentFileType = "image";
    } else {
      vidSrc = `postvideos/${userId}/${file.name}`;
      contentFileType = "video";
    }
    if (contentFileType === "image") {
      await uploadImageFile(file, userId);
    } else {
      await uploadVideoFile(file, userId);
    }
  }

  await db.insert(problemPost).values({
    userId: Number(userId),
    title,
    description,
    commentCount: 0,
    tags,
    imgSrcs: imgSrc ? [imgSrc] : null,
    vidSrc: vidSrc ? [vidSrc] : null,
    contentFileType,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return new Response("OK", {
    status: 200,
  });
}

const uploadImageFile = async (file: File, userId: string) => {
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const params = {
    Bucket: "postimages",
    Key: `${userId}/${file.name}`,
    Body: fileBuffer,
    ContentType: file.type,
  };

  await s3Client.send(new PutObjectCommand(params));
};

const uploadVideoFile = async (file: File, userId: string) => {
  console.log(file.name, userId);
};
