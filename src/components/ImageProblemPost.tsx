import Image from "next/image";
import Stats from "./Stats";
import PostWrapper from "./PostWrapper";
import PostModal from "./PostModal";
import { formatDistanceToNow } from "date-fns";
import ImageWrapper from "./ImageWrapper";

export type ImageProblemProps = {
  data: {
    id: number;
    userId: number;
    postedBy: string | null;
    title: string;
    imgSrc: string[] | null;
    isSaved: boolean;
    isVoted: boolean | null;
    contentFileType: string | null;
    vidSrc: string[] | null;
    description: string | null;
    createdAt: Date;
    stats: {
      upvotes: number;
      downvotes: number;
      comments: number;
    };
  };
};
export default function ImageProblemPost({ data }: ImageProblemProps) {
  // console.log(data.isVoted);
  return (
    <PostWrapper id={data.id}>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 font-bold items-center text-zinc-400">
          <div className="h-6 w-6 rounded-full bg-zinc-500" />
          <h1 className="hover:underline cursor-pointer">{data.postedBy}</h1>
          <p className="text-zinc-500 text-xs font-medium">
            {formatDistanceToNow(data.createdAt)} ago
          </p>
        </div>
        <PostModal
          isSaved={data.isSaved}
          postId={data.id}
          userId={data.userId}
        />
      </div>
      <h1 className="font-medium">{data.title}</h1>
      {data.imgSrc && data.imgSrc.length > 0 && (
        <ImageWrapper imgSrc={data.imgSrc[0]}>
          <Image
            priority
            src={data.imgSrc[0]}
            width={500}
            className="object-contain max-h-96 mx-auto"
            height={500}
            alt="image"
          />
        </ImageWrapper>
      )}
      <div className="text-zinc-400 text-sm">
        <p>{data.description}</p>
      </div>
      <Stats
        postId={data.id}
        upvotes={data.stats.upvotes}
        downvotes={data.stats.downvotes}
        comments={data.stats.comments}
        isVoted={data.isVoted}
        onCommentsClikcHref={`/problem/${data.id}`}
      />
    </PostWrapper>
  );
}
