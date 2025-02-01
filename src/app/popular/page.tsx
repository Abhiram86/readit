import VideoProblemPost from "@/components/VideoProblemPost";

export default function Popular() {
  return (
    <div>
      <h1>Popular</h1>
      <VideoProblemPost
        data={{
          id: 1,
          title: "Video Problem",
          description: "This is a video problem",
          imgSrc: null,
          vidSrc: ["https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"],
          contentFileType: "video",
          postedBy: 1,
          stats: {
            upvotes: 0,
            downvotes: 0,
            comments: 0,
          },
        }}
      />
    </div>
  );
}
