import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AnimeDetail } from "@/components/anime/AnimeDetail";
import { EpisodeList } from "@/components/anime/EpisodeList";
import { connection } from "next/server";

export default async function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params;

  const anime = await prisma.anime.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      originalTitle: true,
      cover: true,
      description: true,
      releaseYear: true,
      region: true,
      status: true,
      totalEpisodes: true,
      tags: { select: { name: true } },
      episodes: {
        select: {
          id: true,
          number: true,
          title: true,
          duration: true,
          isFree: true,
          price: true,
        },
        orderBy: { number: "asc" },
      },
    },
  });

  if (!anime) notFound();

  const serialized = JSON.parse(JSON.stringify(anime));

  const buyAllPrice = serialized.episodes.reduce(
    (sum: number, ep: { isFree: boolean; price: number }) => sum + (ep.isFree ? 0 : Number(ep.price ?? 0)),
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimeDetail anime={serialized} buyAllPrice={buyAllPrice} />

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-bold text-zinc-900">剧集列表</h2>
        <EpisodeList
          episodes={serialized.episodes}
          animeId={serialized.id}
          animeTitle={serialized.title}
        />
      </div>
    </div>
  );
}
