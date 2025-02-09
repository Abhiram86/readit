"use client";

import { IoEllipsisVertical } from "react-icons/io5";
import ModalContainer, { ModalItem } from "./ModalContainer";
import { useState } from "react";
import { MdDelete, MdReport } from "react-icons/md";
import { IoMdBookmark } from "react-icons/io";
import { CiShare2 } from "react-icons/ci";
import toast from "react-hot-toast";

export default function PostModal({ id }: { id: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <IoEllipsisVertical
        onClick={(e) => (e.stopPropagation(), setIsOpen(!isOpen))}
        className="text-zinc-400 cursor-pointer transition-colors h-6 w-6 p-1 rounded-full hover:bg-zinc-700"
      />
      {isOpen && (
        <ModalContainer className="right-0 p-1 w-48 gap-[2px]">
          <ModalItem className="p-1">
            <MdReport className="h-6 w-6 text-zinc-300" />
            <p>report</p>
          </ModalItem>
          <ModalItem className="p-1">
            <IoMdBookmark className="h-6 w-6 text-zinc-500" />
            <p>save</p>
          </ModalItem>
          <ModalItem
            className="p-1"
            onClick={() => (
              navigator.clipboard.writeText("localhost:3000/problem/" + id),
              toast.success("Link copied to clipboard"),
              setIsOpen(false)
            )}
          >
            <CiShare2 className="h-6 w-6 text-zinc-300" />
            <p>share</p>
          </ModalItem>
          <div className="border-b border-zinc-600" />
          <div className="flex cursor-pointer text-red-300 gap-2 rounded hover:ring-1 ring-red-600 mt-[1px] p-1 hover:bg-red-900 bg-red-950">
            <MdDelete className="h-6 w-6" />
            <p>delete</p>
          </div>
        </ModalContainer>
      )}
    </div>
  );
}
