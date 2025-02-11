import { verifyToken } from "@/utils/authSession";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  const data = await verifyToken(token);
  redirect(`/profile/${data?.username}?q=general`);
  return <div>page</div>;
}
