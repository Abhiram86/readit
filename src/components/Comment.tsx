import CommentExtender from "./CommentExtender";
import CommentStats from "./CommentStats";

export type CommentProps = {
  data: {
    id: number;
    postedBy: number;
    text: string;
    upvotes: number;
    downvotes: number;
    level: number;
    parentId: number | null;
    time: Date;
    replies: number;
  };
  problemPostId: number;
  className?: string;
};

export default function Comment({
  data,
  problemPostId,
  className,
}: CommentProps) {
  return (
    <div className={`mt-2 pt-2 relative ${className}`}>
      <div className="relative flex gap-4 font-bold items-center z-10 text-zinc-400">
        <div className="flex gap-1 items-center">
          <div className="h-5 w-5 z-20 rounded-full bg-zinc-500" />
          <h1>{data.postedBy}</h1>
        </div>
        <p className="text-zinc-500 text-xs font-normal">
          {new Date(data.time).toLocaleString()}
        </p>
      </div>
      <div className="pl-6 text-sm">
        <p className="text-zinc-400">{data.text}</p>
        <CommentStats
          problemPostId={problemPostId}
          level={data.level}
          commentId={data.id}
          upvotes={data.upvotes}
          comments={data.replies}
          downvotes={data.downvotes}
        />
      </div>
      {/* {data.replies > 0 && ( */}
      <CommentExtender
        replies={data.replies}
        problemPostId={problemPostId}
        level={data.level + 1}
      />
      {/* )} */}
    </div>
  );
}
