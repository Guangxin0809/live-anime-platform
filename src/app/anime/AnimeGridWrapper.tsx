"use client";

import { useRouter } from "next/navigation";
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

interface Tag {
  id: string;
  name: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface Props {
  animes: Anime[];
  tags: Tag[];
  pagination: Pagination;
  currentTag: string;
}

export function AnimeGridWrapper({ animes, tags, pagination, currentTag }: Props) {
  const router = useRouter();

  function handlePageChange(page: number) {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (currentTag) params.set("tag", currentTag);
    router.push(`/anime?${params.toString()}`);
  }

  function handleTagSelect(tag: string) {
    const params = new URLSearchParams();
    if (tag) params.set("tag", tag);
    router.push(`/anime?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleTagSelect("")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition ${
            !currentTag ? "bg-indigo-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          全部
        </button>
        {tags.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTagSelect(t.name)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              currentTag === t.name
                ? "bg-indigo-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      <AnimeGrid animes={animes} pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
}
