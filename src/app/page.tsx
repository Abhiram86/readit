import { getPosts } from "@/actions/getposts";
import ImageProblemPost from "@/components/ImageProblemPost";
import InfiniteScroll from "@/components/InfiniteScroll";

export default async function Home() {
  const res = await getPosts({ pageParam: undefined });

  // console.log(res);
  return (
    <div className="font-sans p-2 max-w-[44rem]">
      <div className="flex flex-col">
        {res.map(
          (post) =>
            post.imgSrc && <ImageProblemPost key={post.id} data={post} />
        )}
        <InfiniteScroll lastId={res[res.length - 1].id} />
      </div>
    </div>
  );
}
