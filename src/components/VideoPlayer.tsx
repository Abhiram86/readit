"use client";

import Hls from "hls.js";
import { useEffect, useRef } from "react";

export default function VideoPlayer({
  src,
  className = "",
  ...props
}: {
  src: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({ debug: true });

      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS.js error:", event, data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari, which supports HLS natively
      video.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return <video ref={videoRef} controls className={className} {...props} />;
}
