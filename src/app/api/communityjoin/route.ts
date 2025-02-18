import db from "@/db/drizzle";
import { communityMembers } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const communityJoinSchema = z.object({
  userId: z.number(),
  communityId: z.number(),
});

export async function POST(request: Request) {
  const body = await request.json();

  const parsed = communityJoinSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { message: "error", err: parsed.error.message },
      { status: 400 }
    );
  }

  try {
    await db.insert(communityMembers).values(parsed.data);
  } catch (err) {
    if (err instanceof Error) {
      const error = err as { code?: string };
      if (error.code === "23505") {
        await db
          .delete(communityMembers)
          .where(
            and(
              eq(communityMembers.userId, parsed.data.userId),
              eq(communityMembers.communityId, parsed.data.communityId)
            )
          );
        return Response.json(
          { message: "left the community" },
          { status: 200 }
        );
      }
    }
    return Response.json({ message: "error", err: err }, { status: 500 });
  }

  return Response.json({ message: "success" }, { status: 200 });
}
