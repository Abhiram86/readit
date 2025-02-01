"use client";

import { getPosts } from "@/actions/getposts";
// import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ImageProblemPost from "./ImageProblemPost";

export default function InfiniteScroll({ lastId }: { lastId: number }) {
  const { data, error, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["infinte"],
    queryFn: getPosts,
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
    <div>
      {data &&
        data.pages.map((page) =>
          page.map(
            (data) =>
              data.imgSrc && <ImageProblemPost key={data.id} data={data} />
          )
        )}
      <div className="text-center" ref={ref}>
        {isFetchingNextPage && "Loading..."}
      </div>
      {data && data.pages[data.pages.length - 1].length === 0 && (
        <div className="flex flex-row justify-center border-t gap-2 mt-2 pt-4 border-zinc-700 items-center">
          <div>No more posts available</div>
          <div className="bg-gradient-to-br from-violet-700 to-purple-900 w-4 h-4 p-3 rounded-full" />
        </div>
      )}
    </div>
  );
}
