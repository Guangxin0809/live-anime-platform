"use client";

import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  poster?: string | null;
  title?: string;
}

export function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isHls = src.endsWith(".m3u8") || src.includes("m3u8");

    if (isHls && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        playerRef.current = new Plyr(video, {
          captions: { active: true, update: true },
          settings: ["captions", "speed"],
        });
      });

      return () => {
        playerRef.current?.destroy();
        hls.destroy();
      };
    } else {
      video.src = src;
      playerRef.current = new Plyr(video, {
        captions: { active: true, update: true },
        settings: ["captions", "quality", "speed"],
      });

      return () => {
        playerRef.current?.destroy();
      };
    }
  }, [src]);

  return (
    <div className="relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-lg bg-black shadow-lg">
      <video
        ref={videoRef}
        className="h-full w-full"
        poster={poster || undefined}
        controls
        playsInline
      />
      {title && (
        <div className="absolute left-0 right-0 top-0 z-10 bg-gradient-to-b from-black/60 to-transparent px-4 py-3">
          <p className="text-sm font-medium text-white drop-shadow-sm">{title}</p>
        </div>
      )}
    </div>
  );
}
