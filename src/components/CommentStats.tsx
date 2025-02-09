"use client";

import { useUserStore } from "@/store/user";
import axios from "axios";
import { useState } from "react";
import { BiSolidDownvote, BiSolidUpvote } from "react-icons/bi";
import { IoChatbubble } from "react-icons/io5";
import CommentBox from "./CommentBox";

export default function CommentStats({
  problemPostId,
  level,
  commentId,
  upvotes,
  downvotes,
  comments,
}: {
  problemPostId: number;
  level: number;
  commentId: number;
  upvotes: number;
  downvotes: number;
  comments: number;
}) {
  const [votes, setVotes] = useState({
    upvotes: Number(upvotes),
    downvotes: Number(downvotes),
  });
  const [commentBox, setCommentBox] = useState(false);
  const { user } = useUserStore();
  const handleUpdateVotes = async (type: "upvote" | "downvote") => {
    const res = await axios.post("/api/commentvotes", {
      commentId,
      userId: user?.id,
      type,
    });
    if (res.status === 200 && res.data.message === "vote added") {
      if (type === "upvote") {
        setVotes((prev) => ({ ...prev, upvotes: prev.upvotes + 1 }));
      } else {
        setVotes((prev) => ({ ...prev, downvotes: prev.downvotes + 1 }));
      }
    } else if (res.status === 200 && res.data.message === "vote removed") {
      if (type === "upvote") {
        setVotes((prev) => ({ ...prev, upvotes: prev.upvotes - 1 }));
      } else {
        setVotes((prev) => ({ ...prev, downvotes: prev.downvotes - 1 }));
      }
    }
  };
  return (
    <div>
      <div className="flex pt-2 w-32 gap-2 justify-between">
        <div className="flex ring-1 ring-zinc-700 py-2 pl-3 pr-4 divide-x divide-zinc-600 rounded-3xl bg-zinc-800">
          <div className="flex gap-1 items-center pr-2">
            <BiSolidUpvote
              className="h-4 w-4 active:-translate-y-1 hover:text-violet-500 transition-all cursor-pointer text-zinc-400"
              onClick={() => handleUpdateVotes("upvote")}
            />
            <p>{votes.upvotes}</p>
          </div>
          <div className="flex gap-1 items-center pl-1">
            <BiSolidDownvote
              className="h-4 w-4 active:translate-y-1 transition-all hover:text-red-500 cursor-pointer text-zinc-400"
              onClick={() => handleUpdateVotes("downvote")}
            />
            <p>{votes.downvotes}</p>
          </div>
        </div>
        <div
          onClick={() => setCommentBox(!commentBox)}
          className="flex items-center ring-1 ring-zinc-700 gap-1 cursor-pointer hover:bg-zinc-700 py-2 pl-3 pr-4 rounded-3xl bg-zinc-800"
        >
          <IoChatbubble className="h-4 w-4 text-zinc-400" />
          <p>{comments}</p>
        </div>
      </div>
      {commentBox && (
        <div className="pt-2">
          <CommentBox id={problemPostId} level={level} parentId={commentId} />
        </div>
      )}
    </div>
  );
}
