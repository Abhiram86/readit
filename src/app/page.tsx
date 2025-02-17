import { getPosts } from "@/actions/getposts";
import ImageProblemPost from "@/components/ImageProblemPost";
import InfiniteScroll from "@/components/InfiniteScroll";
import { verifyToken } from "@/utils/authSession";
import { cookies } from "next/headers";
// import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const token = (await cookies()).get("token")?.value;
  const userData = token ? await verifyToken(token) : null;
  const searchParam = ((await searchParams) as { q: string }) || null;
  const res = await getPosts({
    pageParam: undefined,
    searchParam: searchParam.q,
    userId: userData ? userData.id : null,
  });
  // console.log(searchParam);

  // console.log(res);
  if (res.length === 0)
    return (
      <div className="font-sans p-2 text-center font-semibold">
        no posts found
      </div>
    );
  return (
    <div className="font-sans p-2 max-w-[44rem]">
      <div className="flex flex-col divide-y divide-zinc-700">
        {res.map((post) => (
          <div key={post.id}>
            <ImageProblemPost data={post} />
          </div>
        ))}
        {res.length > 0 && (
          <InfiniteScroll
            lastId={res[res.length - 1].id}
            searchParam={searchParam.q}
            userId={userData ? userData.id : null}
          />
        )}
      </div>
    </div>
  );
}
