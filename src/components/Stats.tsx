"use client";

import { useUserStore } from "@/store/user";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiSolidDownvote, BiSolidUpvote } from "react-icons/bi";
import { IoChatbubble } from "react-icons/io5";

export default function Stats({
  postId,
  upvotes,
  downvotes,
  comments,
  onCommentsClikcHref,
}: {
  postId: number;
  upvotes: number;
  downvotes: number;
  comments: number;
  onCommentsClikcHref: string;
}) {
  const [votes, setVotes] = useState({
    upvotes: Number(upvotes),
    downvotes: Number(downvotes),
  });
  const { user } = useUserStore();
  const handleUpdateVotes = async (type: "upvote" | "downvote") => {
    if (!user) {
      toast.error("You must be logged in to vote", {
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #52525b",
        },
      });
      return;
    }
    const res = await axios.post("/api/votes", {
      problemPostId: postId,
      userId: user.id,
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
    <div className="flex pt-2 w-32 gap-2 justify-between">
      <div className="flex py-2 pl-3 pr-4 divide-x divide-zinc-600 rounded-3xl bg-zinc-800">
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
      <Link
        href={onCommentsClikcHref}
        className="flex items-center gap-1 cursor-pointer hover:bg-zinc-700 py-2 pl-3 pr-4 rounded-3xl bg-zinc-800"
      >
        <IoChatbubble className="h-4 w-4 text-zinc-400" />
        <p>{comments}</p>
      </Link>
    </div>
  );
}
