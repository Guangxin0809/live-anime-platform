"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CheckoutForm } from "@/components/order/CheckoutForm";
import { Suspense } from "react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const animeId = searchParams.get("animeId");
  const episodeId = searchParams.get("episodeId");

  const [info, setInfo] = useState<{
    animeTitle: string;
    episodeNumber: number | null;
    episodeTitle: string | null;
    price: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!animeId) {
      setLoading(false);
      return;
    }

    async function fetchInfo() {
      try {
        const res = await fetch(`/api/anime/${animeId}`);
        const data = await res.json();
        const anime = data.anime;

        if (episodeId) {
          const ep = anime.episodes?.find((e: { id: string }) => e.id === episodeId);
          if (ep) {
            setInfo({
              animeTitle: anime.title,
              episodeNumber: ep.number,
              episodeTitle: ep.title,
              price: ep.isFree ? 0 : Number(ep.price || 0),
            });
          }
        } else {
          // Purchase entire anime — sum all non-free episodes
          const total = (anime.episodes ?? []).reduce(
            (sum: number, ep: { isFree: boolean; price: number }) =>
              sum + (ep.isFree ? 0 : Number(ep.price || 0)),
            0
          );
          setInfo({
            animeTitle: anime.title,
            episodeNumber: null,
            episodeTitle: null,
            price: total,
          });
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    fetchInfo();
  }, [animeId, episodeId]);

  if (!animeId) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-zinc-400">
        缺少商品信息
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-zinc-400">
        加载中...
      </div>
    );
  }

  if (!info) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-zinc-400">
        未找到商品信息
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">结算</h1>
      <CheckoutForm
        item={{
          animeId,
          episodeId: episodeId || null,
          animeTitle: info.animeTitle,
          episodeNumber: info.episodeNumber,
          episodeTitle: info.episodeTitle,
          price: info.price,
        }}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center text-zinc-400">加载中...</div>}>
        <CheckoutContent />
      </Suspense>
    </ProtectedRoute>
  );
}
