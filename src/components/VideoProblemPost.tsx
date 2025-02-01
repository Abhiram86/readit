import Stats from "./Stats";
import VideoPlayer from "./VideoPlayer";

type ImageProblemProps = {
  data: {
    id: number;
    postedBy: number;
    title: string;
    imgSrc: string[] | null;
    contentFileType: string | null;
    vidSrc: string[] | null;
    description: string | null;
    stats: {
      upvotes: number;
      downvotes: number;
      comments: number;
    };
  };
};

export default function VideoProblemPost({ data }: ImageProblemProps) {
  return (
    <div className="font-san p-2">
      <div className="flex gap-1 font-bold text-zinc-400">
        <div className="h-6 w-6 rounded-full bg-zinc-500" />
        <h1>{data.postedBy}</h1>
      </div>
      <h1 className="font-medium">{data.title}</h1>
      {data.vidSrc && data.vidSrc.length > 0 && (
        <div className="w-full bg-zinc-900 my-2 relative rounded-lg border overflow-hidden border-zinc-700">
          <VideoPlayer src={data.vidSrc[0]} />
        </div>
      )}
      <div className="text-zinc-400 text-sm">
        <p>{data.description}</p>
      </div>
      <Stats
        postId={data.id}
        upvotes={data.stats.upvotes}
        downvotes={data.stats.downvotes}
        comments={data.stats.comments}
        onCommentsClikcHref={`/problem/${data.id}`}
      />
    </div>
  );
}

// ffmpeg command: ffmpeg -i ${videoPath} \
// -map 0:v -c:v libx264 -crf 23 -preset medium -g 48 \
// -map 0:v -c:v libx264 -crf 28 -preset fast -g 48 \
// -map 0:v -c:v libx264 -crf 32 -preset fast -g 48 \
// -map 0:a -c:a aac -b:a 128k \
// -hls_time 10 -hls_playlist_type vod -hls_flags independent_segments -report \
// -f hls ${outputPath}
