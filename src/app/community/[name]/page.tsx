import { getCommunityWithName } from "@/actions/getCommunityWithName";
import Tabs from "@/components/Tabs";
import Image from "next/image";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";

export default async function Community({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const name = decodeURIComponent((await params).name);
  console.log(name);
  const data = await getCommunityWithName(name);
  console.log(data);

  return (
    <div className="p-2 font-sans">
      <div className="relative space-y-1 p-1">
        {data[0].banner && (
          <Image
            src={data[0].banner}
            alt="banner"
            width={100}
            height={100}
            className="w-full mb-4 ring-1 ring-zinc-700 rounded-xl max-h-16 object-cover"
          />
        )}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-2 items-center">
            <div className="h-8 w-8 rounded-full bg-zinc-500" />
            <div className="flex flex-col gap-0">
              <h1 className="">{name}</h1>
              <p className="mb-1 text-xs text-zinc-400">
                members: {data[0].membersCount}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`../../new/${name}`}
              className="px-3 flex gap-1 items-center py-1 ring-1 ring-zinc-700 rounded-3xl hover:ring-zinc-600 transition-colors"
              type="button"
            >
              <BiPlus className="mt-1 w-5 h-5" />
              <p>create post</p>
            </Link>
            <button
              className="px-3 py-1 hover:bg-zinc-900 text-zinc-900 hover:text-zinc-100 bg-zinc-200 ring-1 ring-zinc-500 rounded-3xl transition-colors"
              type="button"
            >
              <p className="font-medium">join</p>
            </button>
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-zinc-400">
          {data[0].description}
        </p>
      </div>
      <Tabs
        prefix="community"
        name={name}
        tabLinks={["posts", "members"]}
        query="posts"
        personalTabLinks={[]}
        showPersonal={true}
      />
    </div>
  );
}
