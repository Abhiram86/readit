"use client";

import { useUserStore } from "@/store/user";
import axios from "axios";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiSolidDownvote, BiSolidUpvote } from "react-icons/bi";
import { FaShare } from "react-icons/fa";
// import { IoMdBookmark } from "react-icons/io";
import { IoChatbubble } from "react-icons/io5";
// import { MdDelete } from "react-icons/md";

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
  const router = useRouter();
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
  // const handleSavePost = async () => {
  //   if (!user) {
  //     toast.error("You must be logged in to save post", {
  //       style: {
  //         background: "#333",
  //         color: "#fff",
  //         border: "1px solid #52525b",
  //       },
  //     });
  //     return;
  //   }
  //   const res = await axios.post("/api/postSave", {
  //     userId: user.id,
  //     problemPostId: postId,
  //   });
  //   if (res.status === 200) {
  //     toast.success("Post saved", {
  //       style: {
  //         background: "#333",
  //         color: "#fff",
  //         border: "1px solid #52525b",
  //       },
  //     });
  //   }
  // };
  return (
    <div className="flex w-full pt-2 gap-2">
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex py-2 pl-3 pr-4 ring-1 ring-zinc-700 divide-x divide-zinc-600 rounded-3xl bg-zinc-800"
      >
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
      <div className="flex flex-wrap w-full justify-between gap-2">
        <div
          onClick={() => router.push(onCommentsClikcHref)}
          className="flex items-center transition-colors ring-1 ring-zinc-700 gap-1 cursor-pointer hover:bg-zinc-700 py-2 pl-3 pr-4 rounded-3xl bg-zinc-800"
        >
          <IoChatbubble className="h-4 w-4 text-zinc-400" />
          <p>{comments}</p>
        </div>
        {/* <div
          className="flex ring-1 ring-zinc-700 transition-colors items-center gap-1 cursor-pointer hover:bg-zinc-700 py-2 px-3 rounded-3xl bg-zinc-800"
          onClick={(e) => (e.stopPropagation(), handleSavePost)}
        >
          <IoMdBookmark className="h-5 w-5 text-zinc-400" />
        </div> */}
        {/* <div
          onClick={(e) => e.stopPropagation()}
          className="flex ring-1 ring-red-900 transition-colors items-center gap-1 cursor-pointer hover:bg-red-900 py-2 px-3 rounded-3xl bg-red-950"
        >
          <MdDelete className="h-5 w-5 text-red-400" />
        </div> */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex ring-1 ring-zinc-700 transition-colors items-center gap-1 cursor-pointer hover:bg-zinc-700 py-2 px-3 rounded-3xl bg-zinc-800"
        >
          <FaShare className="h-5 w-5 text-zinc-400" />
        </div>
      </div>
    </div>
  );
}
