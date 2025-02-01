import ImageProblemPost from "@/components/ImageProblemPost";
import Comment from "@/components/Comment";
import CommentBox from "@/components/CommentBox";
import { getPostWithComments } from "@/actions/getpostWithId";

export default async function Problem({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [res1, res2] = await getPostWithComments(Number(slug));
  console.log(res2.status === "fulfilled" && res2.value);

  return (
    <div className="font-sans">
      {res1.status === "fulfilled" ? (
        <ImageProblemPost data={res1.value} />
      ) : (
        <p>Error fetching post</p>
      )}
      <div className="mt-2 px-2 pt-4 border-t border-zinc-700">
        <CommentBox id={Number(slug)} level={0} parentId={null} />
      </div>
      <div className="pt-2 px-2">
        {res2.status === "fulfilled" ? (
          res2.value.map((data) => (
            <Comment key={data.id} problemPostId={Number(slug)} data={data} />
          ))
        ) : (
          <p>Error fetching comments</p>
        )}
      </div>
    </div>
  );
}
