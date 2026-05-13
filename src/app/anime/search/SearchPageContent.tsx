"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/anime/SearchBar";
import { AnimeGrid } from "@/components/anime/AnimeGrid";

interface Anime {
  id: string;
  title: string;
  cover: string | null;
  releaseYear: number | null;
  region: string | null;
  status: string;
  totalEpisodes: number | null;
  tags: { name: string }[];
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const tag = searchParams.get("tag") ?? "";

  const [animes, setAnimes] = useState<Anime[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function doSearch() {
      if (!q && !tag) return;
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (tag) params.set("tag", tag);
        const res = await fetch(`/api/anime/search?${params.toString()}`);
        const data = await res.json();
        setAnimes(data.animes ?? []);
        setPagination(data.pagination ?? null);
      } catch {
        setAnimes([]);
      } finally {
        setLoading(false);
      }
    }
    doSearch();
  }, [q, tag]);

  function handlePageChange(page: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (tag) params.set("tag", tag);
    params.set("page", String(page));
    router.push(`/anime/search?${params.toString()}`);
  }

  const hasQuery = !!(q || tag);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">搜索</h1>

      <SearchBar />

      <div className="mt-8">
        {loading ? (
          <div className="py-24 text-center text-zinc-400">搜索中...</div>
        ) : !hasQuery ? (
          <div className="py-24 text-center text-zinc-400">输入关键词或选择标签开始搜索</div>
        ) : animes.length === 0 ? (
          <div className="py-24 text-center text-zinc-400">未找到相关动漫</div>
        ) : (
          <AnimeGrid
            animes={animes}
            pagination={pagination ?? { page: 1, pageSize: 20, total: 0, totalPages: 0 }}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
