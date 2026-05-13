"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { Skeleton } from "@/components/ui/Skeleton";

interface EpisodeData {
  id: string;
  number: number;
  title: string | null;
  duration: number | null;
  videoUrl: string | null;
  anime: { id: string; title: string };
}

export default function EpisodePage({ params }: { params: Promise<{ id: string; episodeId: string }> }) {
  const { id: animeId, episodeId } = use(params);
  const [episode, setEpisode] = useState<EpisodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorStatus, setErrorStatus] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(`/api/anime/${animeId}/episode/${episodeId}`, { headers })
      .then(async (res) => {
        if (!res.ok) {
          setErrorStatus(res.status);
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load episode");
        }
        return res.json();
      })
      .then((data) => setEpisode(data.episode))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [animeId, episodeId]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Skeleton className="mb-4 h-4 w-32" />
        <Skeleton className="aspect-video w-full max-w-4xl rounded-lg" />
        <div className="mx-auto mt-4 max-w-4xl">
          <Skeleton className="mb-2 h-6 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  if (errorStatus === 404 || (!loading && !episode)) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Link href={`/anime/${animeId}`} className="mb-4 inline-block text-sm text-indigo-600 hover:text-indigo-700">
          &larr; 返回详情
        </Link>
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <h2 className="mb-2 text-xl font-semibold text-zinc-800">剧集未找到</h2>
          <p className="text-sm text-zinc-500">该剧集不存在或已被移除</p>
        </div>
      </div>
    );
  }

  if (errorStatus === 401) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Link href={`/anime/${animeId}`} className="mb-4 inline-block text-sm text-indigo-600 hover:text-indigo-700">
          &larr; 返回详情
        </Link>
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <h2 className="mb-2 text-xl font-semibold text-zinc-800">请先登录</h2>
          <p className="mb-4 text-sm text-zinc-500">需要登录后观看此剧集</p>
          <Link
            href="/auth/login"
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            去登录
          </Link>
        </div>
      </div>
    );
  }

  if (errorStatus === 403) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Link href={`/anime/${animeId}`} className="mb-4 inline-block text-sm text-indigo-600 hover:text-indigo-700">
          &larr; 返回详情
        </Link>
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <h2 className="mb-2 text-xl font-semibold text-zinc-800">需要购买</h2>
          <p className="mb-4 text-sm text-zinc-500">请先购买此剧集后再观看</p>
          <Link
            href={`/order/checkout?animeId=${animeId}&episodeId=${episodeId}`}
            className="rounded-lg bg-amber-600 px-5 py-2 text-sm font-medium text-white hover:bg-amber-700"
          >
            去购买
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <Link href={`/anime/${animeId}`} className="mb-4 inline-block text-sm text-indigo-600 hover:text-indigo-700">
          &larr; 返回详情
        </Link>
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (!episode) return null;

  const hasVideo = !!episode.videoUrl;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Link
        href={`/anime/${animeId}`}
        className="mb-4 inline-block text-sm text-indigo-600 hover:text-indigo-700"
      >
        &larr; {episode.anime.title}
      </Link>

      {hasVideo ? (
        <>
          <VideoPlayer
            src={episode.videoUrl!}
            title={`第${episode.number}话${episode.title ? ` - ${episode.title}` : ""}`}
          />
          <div className="mx-auto mt-4 max-w-4xl">
            <h1 className="text-lg font-semibold text-zinc-800">
              {episode.anime.title} - 第{episode.number}话
            </h1>
            {episode.title && (
              <p className="text-sm text-zinc-500">{episode.title}</p>
            )}
            {episode.duration && (
              <p className="mt-1 text-xs text-zinc-400">时长：{episode.duration} 分钟</p>
            )}
          </div>
        </>
      ) : (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-zinc-100 p-4">
            <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mb-1 text-lg font-semibold text-zinc-800">视频源未上线</h2>
          <p className="text-sm text-zinc-500">该剧集视频正在准备中，请稍后再来观看</p>
        </div>
      )}
    </div>
  );
}
