"use client";

import { getPosts } from "@/actions/getposts";
// import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ImageProblemPost from "./ImageProblemPost";

export default function InfiniteScroll({
  lastId,
  searchParam,
  userId,
}: {
  lastId: number;
  searchParam?: string;
  userId: number | null;
}) {
  const { data, error, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["infinte", searchParam],
    queryFn: ({ pageParam }) =>
      getPosts({ pageParam, searchParam, userId: userId }),
    initialPageParam: lastId,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1].id;
    },
    staleTime: 60 * 1000,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (error) {
    console.log(error);
  }
  return (
    <div className="divide-y divide-zinc-700">
      {data &&
        data.pages.map((page) =>
          page.map(
            (data) =>
              data.imgSrc && (
                <div key={data.id}>
                  <ImageProblemPost data={data} />
                </div>
              )
          )
        )}
      <div className="text-center" ref={ref}>
        {isFetchingNextPage && "Loading..."}
      </div>
      {data && data.pages[data.pages.length - 1].length === 0 && (
        <div className="flex flex-row justify-center gap-2 pt-4 items-center">
          <div>No more posts available</div>
          <div className="bg-gradient-to-br from-violet-700 to-purple-900 w-4 h-4 p-3 rounded-full" />
        </div>
      )}
    </div>
  );
}
