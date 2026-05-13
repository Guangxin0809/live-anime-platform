import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";

export const dynamic = "force-dynamic";

interface HomeAnime {
  id: string;
  title: string;
  cover: string | null;
  releaseYear: number | null;
  region: string | null;
  status: string;
  tags: { name: string }[];
  _count: { episodes: number };
}

export default async function Home() {
  const animes = await prisma.anime.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      cover: true,
      releaseYear: true,
      region: true,
      status: true,
      tags: { select: { name: true } },
      _count: { select: { episodes: true } },
    },
  });

  return (
    <div className="flex flex-col">
      <HeroSection />

      <section className="border-t border-zinc-100 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900">热门动漫</h2>
            <Link
              href="/anime"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              查看全部 &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {animes.map((anime) => (
              <Link
                key={anime.id}
                href={`/anime/${anime.id}`}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-100">
                  {anime.cover ? (
                    <img
                      src={anime.cover}
                      alt={anime.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl font-bold text-zinc-300">
                        {anime.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                    anime.status === "ONGOING" ? "bg-green-500 text-white" :
                    anime.status === "FINISHED" ? "bg-blue-500 text-white" :
                    "bg-amber-500 text-white"
                  }`}>
                    {anime.status === "ONGOING" ? "连载" : anime.status === "FINISHED" ? "完结" : "预告"}
                  </span>
                </div>
                <h3 className="mt-2 truncate text-sm font-medium text-zinc-800 group-hover:text-indigo-600">
                  {anime.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  {anime.releaseYear && <span>{anime.releaseYear}</span>}
                  {anime.region && <span>{anime.region}</span>}
                  {anime._count.episodes > 0 && <span>{anime._count.episodes} 集</span>}
                </div>
                {anime.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {anime.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag.name}
                        className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
