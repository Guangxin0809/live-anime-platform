"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Episode {
  id: string;
  number: number;
  title: string | null;
  duration: number | null;
  isFree: boolean;
  price: number | string | null;
}

interface EpisodeListProps {
  episodes: Episode[];
  animeId: string;
  animeTitle: string;
}

export function EpisodeList({ episodes, animeId }: EpisodeListProps) {
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set());
  const [wholeAnime, setWholeAnime] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`/api/order/purchased?animeId=${animeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setPurchasedIds(new Set(data.episodeIds ?? []));
        setWholeAnime(!!data.wholeAnime);
      })
      .catch(() => {});
  }, [animeId]);

  if (episodes.length === 0) {
    return (
      <div className="rounded-lg bg-zinc-50 py-12 text-center text-zinc-400">
        暂无剧集
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {episodes.map((ep) => {
        const isPurchased = wholeAnime || purchasedIds.has(ep.id);

        return (
          <div key={ep.id} className="rounded-lg border border-zinc-200 p-3">
            <span className="text-xs text-zinc-400">第{ep.number}话</span>
            <p className="truncate text-sm font-medium text-zinc-800">
              {ep.title || `第${ep.number}话`}
            </p>
            <div className="mt-1 flex items-center gap-2">
              {ep.isFree || isPurchased ? (
                <Link
                  href={`/anime/${animeId}/episode/${ep.id}`}
                  className="text-xs text-green-600 hover:text-green-700"
                >
                  {isPurchased ? "观看" : "免费观看"}
                </Link>
              ) : (
                <>
                  <span className="text-xs font-medium text-amber-600">
                    ¥{Number(ep.price).toFixed(2)}
                  </span>
                  <Link
                    href={`/order/checkout?animeId=${animeId}&episodeId=${ep.id}`}
                    className="ml-auto rounded bg-indigo-600 px-2 py-0.5 text-xs text-white hover:bg-indigo-700"
                  >
                    购买
                  </Link>
                </>
              )}
              {ep.duration && (
                <span className="ml-auto text-xs text-zinc-400">{ep.duration}min</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
