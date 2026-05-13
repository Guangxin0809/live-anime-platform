import Link from "next/link";

interface AnimeCardProps {
  id: string;
  title: string;
  cover: string | null;
  releaseYear: number | null;
  region: string | null;
  status: string;
  totalEpisodes: number | null;
  tags: { name: string }[];
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

export function AnimeCard({ id, title, cover, releaseYear, region, status, totalEpisodes, tags }: AnimeCardProps) {
  return (
    <Link href={`/anime/${id}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden rounded-lg bg-zinc-100">
        {cover ? (
          <img src={cover} alt={title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-zinc-100 p-4">
            <span className="text-center text-sm text-zinc-400">{title}</span>
          </div>
        )}
      </div>
      <div className="mt-2 space-y-1">
        <h3 className="truncate text-sm font-medium text-zinc-900 group-hover:text-indigo-600">{title}</h3>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          {releaseYear && <span>{releaseYear}</span>}
          {region && <span>{region}</span>}
          {totalEpisodes != null && <span>{totalEpisodes}集</span>}
        </div>
        <div className="flex flex-wrap gap-1">
          <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${STATUS_STYLE[status] || "bg-zinc-100 text-zinc-600"}`}>
            {STATUS_LABEL[status] || status}
          </span>
          {tags.slice(0, 2).map((t) => (
            <span key={t.name} className="rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] text-zinc-600">
              {t.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
