import { prisma } from "@/lib/prisma";
import { AnimeGridWrapper } from "./AnimeGridWrapper";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function AnimeListPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const pageSize = 20;
  const tag = sp.tag?.trim() || "";

  const where = tag ? { tags: { some: { name: tag } } } : {};

  const [animes, total] = await Promise.all([
    prisma.anime.findMany({
      where,
      select: {
        id: true,
        title: true,
        cover: true,
        releaseYear: true,
        region: true,
        status: true,
        totalEpisodes: true,
        tags: { select: { name: true } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.anime.count({ where }),
  ]);

  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">动漫列表</h1>

      <AnimeGridWrapper
        animes={JSON.parse(JSON.stringify(animes))}
        tags={JSON.parse(JSON.stringify(tags))}
        pagination={{
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        }}
        currentTag={tag}
      />
    </div>
  );
}
