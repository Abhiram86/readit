import { z } from "zod";
import db from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createToken } from "@/utils/authSession";
import { comparePassword } from "@/utils/passwordHash";
import { cookies } from "next/headers";

const signinSchema = z.object({
  email: z.string().email().min(6),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = signinSchema.safeParse(body);

  if (!parsed.success) {
    console.log(parsed.error);
  }

  const userdata = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.data!.email));

  if (!userdata.length || userdata.length === 0) {
    return Response.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const { password, ...userData } = userdata[0];

  if (!comparePassword(parsed.data!.password, password)) {
    return Response.json(
      { error: "Invalid email or password" },
      {
        status: 401,
      }
    );
  }

  const token = await createToken(userData);

  (await cookies()).set("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return Response.json({ token }, { status: 200 });
}
