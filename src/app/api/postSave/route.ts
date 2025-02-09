import db from "@/db/drizzle";
import { savedPosts } from "@/db/schema";
import { z } from "zod";

const savePostSchema = z.object({
  userId: z.number(),
  problemPostId: z.number(),
});

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = savePostSchema.safeParse(body);

  if (!parsed.success) {
    return new Response(parsed.error.message, { status: 400 });
  }

  try {
    await db
      .insert(savedPosts)
      .values({ ...parsed.data, createdAt: new Date() });

    return Response.json({ message: "success" });
  } catch (error) {
    return Response.json({ message: "error", err: error }, { status: 500 });
  }
}
