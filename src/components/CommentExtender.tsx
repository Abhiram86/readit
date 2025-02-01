"use client";

import { getLevelComments } from "@/actions/getLevelComments";
import { useState } from "react";
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";
import Comment from "./Comment";
import { useQuery } from "@tanstack/react-query";

export default function CommentExtender({
  problemPostId,
  level,
  replies,
}: {
  problemPostId: number;
  level: number;
  replies: number;
}) {
  const [collapse, setCollapse] = useState(true);
  const { data: childComments } = useQuery({
    queryKey: ["childComments", problemPostId, level],
    queryFn: () => getLevelComments(problemPostId, level),
    staleTime: 60 * 1000,
    enabled: !collapse,
  });
  return (
    <>
      <div
        onClick={() => setCollapse((prev) => !prev)}
        className={`${
          replies > 0
            ? "h-full top-[7px] flex flex-col py-1 cursor-pointer absolute z-0 -left-[2px] group items-center gap-0"
            : ""
        }`}
      >
        {level > 2 && (
          <div
            className={`p-2 ${
              replies > 0 ? "top-0 -left-[12.5px]" : "top-2 -left-[14.25px]"
            } border-l-2 border-b-2 rounded-b-xl group-hover:border-zinc-300 border-zinc-700 absolute`}
          />
        )}
        <div className="h-full border-l-2 group-hover:border-zinc-300 border-zinc-700" />
        {replies > 0 &&
          (collapse ? (
            <BiPlusCircle className="h-6 w-6 group-hover:text-zinc-300 text-zinc-700" />
          ) : (
            <BiMinusCircle className="h-6 w-6 group-hover:text-zinc-300 text-zinc-700" />
          ))}
      </div>
      {childComments &&
        childComments.length > 0 &&
        !collapse &&
        replies > 0 &&
        childComments.map((comment) => (
          <Comment
            className="ml-6"
            key={comment.id}
            data={comment}
            problemPostId={problemPostId}
          />
        ))}
    </>
  );
}
