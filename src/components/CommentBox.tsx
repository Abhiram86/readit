"use client";

import { useUserStore } from "@/store/user";
import axios from "axios";
import { useRef } from "react";

export default function CommentBox({
  id,
  level,
  parentId,
}: {
  id: number;
  level: number;
  parentId: number | null;
}) {
  const { user } = useUserStore();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const handlePostComment = async () => {
    const res = await axios.post("/api/postcomment", {
      comment: inputRef.current?.value,
      problemPostId: id,
      userId: user?.id,
      level: level,
      parentCommentId: parentId || undefined,
    });
    console.log(res);
  };
  return (
    <div>
      <textarea
        rows={4}
        className="p-3 pb-6 peer hover:h-auto bg-zinc-800 hover:bg-zinc-700 rounded-xl outline-none w-full transition-colors focus:bg-zinc-900"
        placeholder="Write a comment..."
        ref={inputRef}
      />
      <button
        className="py-2 hover:bg-violet-700 hover:ring-0 peer-focus:bg-violet-700 peer-focus:ring-0 px-4 rounded-xl border-0 ring-1 ring-violet-950 transition-colors w-full text-zinc-100"
        onClick={handlePostComment}
      >
        post
      </button>
    </div>
  );
}
