import { getCommunitiePosts } from "@/actions/getCommunitiePosts";
import ImageProblemPost from "./ImageProblemPost";

export default async function CommunityPosts({ name }: { name: string }) {
  const communityPosts = await getCommunitiePosts(name, 0);
  console.log(communityPosts);

  return (
    <div className="flex flex-col divide-y max-w-[44rem] divide-zinc-700">
      {communityPosts.map((post) => (
        <div className="pt-[1px]" key={post.id}>
          <ImageProblemPost data={post} />
        </div>
      ))}
    </div>
  );
}
