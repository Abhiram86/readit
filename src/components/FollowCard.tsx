"use client";

export default function FollowCard({
  // followerId,
  // userId,
  type,
  name,
}: {
  // followerId: number;
  // userId: number;
  type: "follower" | "following";
  name: string | null;
}) {
  return (
    <div className="flex py-2 px-2 justify-between">
      <div className="flex gap-2 items-center">
        <div className="h-6 w-6 rounded-full bg-zinc-500" />
        <p>{name}</p>
      </div>
      <button
        className="px-3 py-1 hover:bg-zinc-700 bg-zinc-900 ring-1 ring-zinc-700 rounded-3xl transition-colors"
        type="button"
      >
        {type === "follower" ? "follow" : "unfollow"}
      </button>
    </div>
  );
}
