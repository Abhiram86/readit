// import getBasicProfile from "@/actions/getProfile";
// import EditForm from "@/components/EditForm";
import ProfileGroup from "@/components/ProfileGroup";
import Tabs from "@/components/Tabs";
import { verifyToken } from "@/utils/authSession";
import { cookies } from "next/headers";
import { FaRegPenToSquare } from "react-icons/fa6";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  const data = await verifyToken(token);
  const query = ((await searchParams) as { q: string }) || null;

  return (
    <div className="p-2 font-sans">
      <div>
        <div className="flex text-lg relative font-medium text-zinc-300 justify-center items-center gap-2">
          <div className="rounded-full bg-zinc-400 p-4 w-2 h-2" />
          <p>{data?.username}</p>
          <FaRegPenToSquare className="text-zinc-400 hover:text-zinc-300 cursor-pointer" />
          {/* <EditForm /> */}
        </div>
        <Tabs query={query.q || "general"} />
        <ProfileGroup id={data!.id} query={query.q || "general"} />
      </div>
    </div>
  );
}
