"use client";

import { AnimeCard } from "./AnimeCard";

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

interface AnimeGridProps {
  animes: Anime[];
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function AnimeGrid({ animes, pagination, onPageChange }: AnimeGridProps) {
  if (animes.length === 0) {
    return (
      <div className="flex flex-col items-center py-24 text-zinc-400">
        <svg className="mb-4 h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4H4a1 1 0 00-1 1v14a2 2 0 002 2h14a2 2 0 002-2V5a1 1 0 00-1-1h-3" />
        </svg>
        <p className="text-lg">暂无动漫</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {animes.map((anime) => (
          <AnimeCard key={anime.id} {...anime} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            上一页
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - pagination.page) <= 2 || p === 1 || p === pagination.totalPages)
            .map((p, idx, arr) => (
              <span key={p} className="flex items-center gap-1">
                {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-zinc-300">...</span>}
                <button
                  onClick={() => onPageChange(p)}
                  className={`h-8 w-8 rounded-lg text-sm ${
                    p === pagination.page ? "bg-indigo-600 text-white" : "text-zinc-600 hover:bg-zinc-100"
                  }`}
                >
                  {p}
                </button>
              </span>
            ))}

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
