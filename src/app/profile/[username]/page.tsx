// import getBasicProfile from "@/actions/getProfile";
// import EditForm from "@/components/EditForm";
import ProfileGroup from "@/components/ProfileGroup";
import Tabs from "@/components/Tabs";
import { verifyToken } from "@/utils/authSession";
import { cookies } from "next/headers";
import { FaRegPenToSquare } from "react-icons/fa6";

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  const username = (await params).username;
  // console.log(username);
  const data = await verifyToken(token);
  const query = ((await searchParams) as { q: string }) || null;

  return (
    <div className="p-2 font-sans">
      {/* <div> */}
      <div className="flex text-lg w-fit mx-auto relative font-medium text-zinc-300 items-center gap-2">
        <div className="rounded-full bg-zinc-400 p-4 w-2 h-2" />
        <p>{username}</p>
        {username === data?.username && (
          <FaRegPenToSquare className="text-zinc-400 hover:text-zinc-300 cursor-pointer" />
        )}
        {username !== data?.username && (
          <button
            className="px-3 py-1 text-sm hover:bg-zinc-700 ring-1 ring-zinc-700 rounded-3xl transition-colors"
            type="button"
          >
            unfollow
          </button>
        )}
        {/* <EditForm /> */}
      </div>
      <Tabs
        showPersonal={data?.username === username}
        name={username}
        query={query.q || "general"}
        prefix="profile"
        personalTabLinks={personalTabLinks}
        tabLinks={tabLinks}
      />
      <ProfileGroup
        username={username}
        id={data!.id}
        query={query.q || "general"}
      />
      {/* </div> */}
    </div>
  );
}

const personalTabLinks = [
  "Following",
  "Followers",
  "Upvoted",
  "Downvoted",
  "Saved",
];

const tabLinks = [
  "General",
  "Posts",
  "Following",
  "Followers",
  "Upvoted",
  "Downvoted",
  "Comments",
  "Saved",
];
