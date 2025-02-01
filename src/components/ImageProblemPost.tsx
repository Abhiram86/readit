import Image from "next/image";
import Stats from "./Stats";
import { IoEllipsisVertical } from "react-icons/io5";

type ImageProblemProps = {
  data: {
    id: number;
    postedBy: number;
    title: string;
    imgSrc: string[] | null;
    contentFileType: string | null;
    vidSrc: string[] | null;
    description: string | null;
    stats: {
      upvotes: number;
      downvotes: number;
      comments: number;
    };
  };
};

export default function ImageProblemPost({ data }: ImageProblemProps) {
  return (
    <div className="font-san p-2 transition-all rounded-lg">
      <div className="flex justify-between bosrder items-center">
        <div className="flex gap-1 font-bold text-zinc-400">
          <div className="h-6 w-6 rounded-full bg-zinc-500" />
          <h1>{data.postedBy}</h1>
        </div>
        <IoEllipsisVertical className="text-zinc-400 cursor-pointer transition-colors h-6 w-6 p-1 rounded-full hover:bg-zinc-700" />
      </div>
      <h1 className="font-medium">{data.title}</h1>
      {data.imgSrc && data.imgSrc.length > 0 && (
        <div className="w-full bg-zinc-900 my-2 relative rounded-lg border overflow-hidden border-zinc-700">
          <Image
            priority
            src={data.imgSrc[0]}
            width={500}
            className="object-contain w max-h-96 mx-auto"
            height={500}
            alt="image"
          />
        </div>
      )}
      <div className="text-zinc-400 text-sm">
        <p>{data.description}</p>
      </div>
      <Stats
        postId={data.id}
        upvotes={data.stats.upvotes}
        downvotes={data.stats.downvotes}
        comments={data.stats.comments}
        onCommentsClikcHref={`/problem/${data.id}`}
      />
    </div>
  );
}
