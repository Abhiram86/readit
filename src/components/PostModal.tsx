"use client";

import { IoEllipsisVertical } from "react-icons/io5";
import ModalContainer, { ModalItem } from "./ModalContainer";
import { useState } from "react";
import { MdDelete, MdReport } from "react-icons/md";
import { IoMdBookmark } from "react-icons/io";
import { CiShare2 } from "react-icons/ci";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/user";
import axios from "axios";

export default function PostModal({
  postId,
  userId,
}: {
  postId: number;
  userId: number;
}) {
  const { user } = useUserStore();
  const handleSavePost = async () => {
    if (!user) {
      toast.error("You must be logged in to save post", {
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #52525b",
        },
      });
      return;
    }
    const res = await axios.post("/api/postSave", {
      userId: user.id,
      problemPostId: postId,
    });
    if (res.status === 200) {
      toast.success("Post saved", {
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #52525b",
        },
      });
    } else {
      toast.error("Something went wrong", {
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #52525b",
        },
      });
    }
  };
  const handleFollow = async () => {
    if (!user) {
      toast.error("You must be logged in to follow", {
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #52525b",
        },
      });
      return;
    }
    const res = await axios.post("/api/follow", {
      userId: user.id,
      followerId: userId,
    });
    if (res.status === 200) {
      toast.success("following", {
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #52525b",
        },
      });
    } else {
      toast.error("Something went wrong", {
        style: {
          background: "#333",
          color: "#fff",
          border: "1px solid #52525b",
        },
      });
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <IoEllipsisVertical
        onClick={(e) => (e.stopPropagation(), setIsOpen(!isOpen))}
        className="text-zinc-400 cursor-pointer transition-colors h-6 w-6 p-1 rounded-full hover:bg-zinc-700"
      />
      {isOpen && (
        <ModalContainer className="right-0 p-1 w-48 gap-[2px]">
          <button
            onClick={() => (handleFollow(), setIsOpen(false))}
            className="bg-violet-700 transition-all ring-1 ring-violet-500 hover:ring-zinc-600 hover:bg-zinc-800 w-full font-medium text-zinc-100 py-1 rounded"
          >
            follow
          </button>
          <ModalItem
            onClick={() => (handleSavePost(), setIsOpen(false))}
            className="p-1"
          >
            <IoMdBookmark className="h-6 w-6 text-zinc-500" />
            <p>save</p>
          </ModalItem>
          <ModalItem
            className="p-1"
            onClick={() => (
              navigator.clipboard.writeText("localhost:3000/problem/" + postId),
              toast.success("Link copied to clipboard"),
              setIsOpen(false)
            )}
          >
            <CiShare2 className="h-6 w-6 text-zinc-300" />
            <p>share</p>
          </ModalItem>
          <ModalItem className="p-1 text-yellow-200">
            <MdReport className="h-6 w-6" />
            <p>report</p>
          </ModalItem>
          <div className="border-b border-red-600" />
          <div className="flex cursor-pointer text-red-300 gap-2 rounded hover:ring-1 ring-red-600 mt-[1px] p-1 hover:bg-red-900 bg-red-950">
            <MdDelete className="h-6 w-6" />
            <p>delete</p>
          </div>
        </ModalContainer>
      )}
    </div>
  );
}
