import { z } from "zod";
import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { hashPassword } from "@/utils/passwordHash";

const signupSchema = z.object({
  username: z.string().min(3),
  email: z.string().email().min(6),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    console.log(parsed.error);
    return new Response(parsed.error.message, { status: 400 });
  }

  const hashedPassword = hashPassword(parsed.data.password);

  parsed.data.password = await hashedPassword;

  await db
    .insert(users)
    .values({ ...parsed.data, createdAt: new Date(), updatedAt: new Date() });
  return new Response("account created successfully", { status: 200 });
}
