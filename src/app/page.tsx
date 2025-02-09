import { getPosts } from "@/actions/getposts";
import ImageProblemPost from "@/components/ImageProblemPost";
import InfiniteScroll from "@/components/InfiniteScroll";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParam = ((await searchParams) as { q: string }) || null;
  const res = await getPosts({
    pageParam: undefined,
    searchParam: searchParam.q,
  });
  // console.log(searchParam);

  console.log(res.length);
  return (
    <div className="font-sans p-2 max-w-[44rem]">
      <div className="flex flex-col">
        {res.map((post) => (
          <ImageProblemPost key={post.id} data={post} />
        ))}
        {/* {res.length > 0 && ( */}
        <InfiniteScroll
          lastId={res[res.length - 1].id}
          searchParam={searchParam.q}
        />
        {/* )} */}
      </div>
    </div>
  );
}
