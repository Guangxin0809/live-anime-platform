import Link from "next/link";

interface Tag {
  name: string;
}

interface AnimeDetailData {
  id: string;
  title: string;
  originalTitle: string | null;
  cover: string | null;
  description: string | null;
  releaseYear: number | null;
  region: string | null;
  status: string;
  totalEpisodes: number | null;
  tags: Tag[];
}

const STATUS_LABEL: Record<string, string> = {
  ONGOING: "连载中",
  FINISHED: "已完结",
  UPCOMING: "即将上映",
};

const STATUS_STYLE: Record<string, string> = {
  ONGOING: "bg-green-100 text-green-700",
  FINISHED: "bg-blue-100 text-blue-700",
  UPCOMING: "bg-amber-100 text-amber-700",
};

export function AnimeDetail({ anime, buyAllPrice }: { anime: AnimeDetailData; buyAllPrice?: number }) {
  return (
    <div className="grid gap-8 md:grid-cols-[300px_1fr]">
      <div>
        <div className="aspect-[3/4] overflow-hidden rounded-xl bg-zinc-100">
          {anime.cover ? (
            <img src={anime.cover} alt={anime.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-zinc-100 p-6">
              <span className="text-center text-zinc-400">{anime.title}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{anime.title}</h1>
          {anime.originalTitle && <p className="mt-1 text-sm text-zinc-400">{anime.originalTitle}</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[anime.status] || "bg-zinc-100 text-zinc-600"}`}>
            {STATUS_LABEL[anime.status] || anime.status}
          </span>
          {anime.tags.map((t) => (
            <Link
              key={t.name}
              href={`/anime/search?tag=${encodeURIComponent(t.name)}`}
              className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-200"
            >
              {t.name}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          {anime.releaseYear && (
            <div>
              <span className="text-zinc-400">上映年份</span>
              <p className="font-medium text-zinc-800">{anime.releaseYear}</p>
            </div>
          )}
          {anime.region && (
            <div>
              <span className="text-zinc-400">地区</span>
              <p className="font-medium text-zinc-800">{anime.region}</p>
            </div>
          )}
          {anime.totalEpisodes != null && (
            <div>
              <span className="text-zinc-400">总集数</span>
              <p className="font-medium text-zinc-800">{anime.totalEpisodes}集</p>
            </div>
          )}
        </div>

        {buyAllPrice != null && buyAllPrice > 0 && (
          <Link
            href={`/order/checkout?animeId=${anime.id}`}
            className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            购买整部 ¥{buyAllPrice.toFixed(2)}
          </Link>
        )}

        {anime.description && (
          <div>
            <h2 className="mb-2 text-sm font-medium text-zinc-500">简介</h2>
            <p className="leading-relaxed text-zinc-700">{anime.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
