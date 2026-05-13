import { prisma } from "../src/lib/prisma";

const API_BASE = "https://api.jikan.moe/v4";

const STATUS_MAP: Record<string, string> = {
  "Currently Airing": "ONGOING",
  "Finished Airing": "FINISHED",
  "Not yet aired": "UPCOMING",
};

const GENRE_ZH: Record<string, string> = {
  Action: "动作",
  Adventure: "冒险",
  "Award Winning": "获奖",
  Comedy: "喜剧",
  Drama: "剧情",
  Fantasy: "奇幻",
  Mystery: "悬疑",
  Romance: "恋爱",
  "Sci-Fi": "科幻",
  "Slice of Life": "日常",
  Sports: "运动",
  Supernatural: "超自然",
  Suspense: "惊悚",
  Ecchi: "擦边",
  Historical: "历史",
  Horror: "恐怖",
  Isekai: "异世界",
  Kids: "儿童",
  Magic: "魔法",
  "Martial Arts": "武术",
  Mecha: "机甲",
  Military: "军事",
  Music: "音乐",
  Psychological: "心理",
  School: "校园",
  Seinen: "青年",
  Shoujo: "少女",
  Shounen: "少年",
  Space: "太空",
  Thriller: "惊悚",
  Hentai: "成人",
  Parody: " parody ",
  Police: "警察",
  Samurai: "武士",
};

interface JikanTitle {
  type: string;
  title: string;
}

interface JikanAnime {
  mal_id: number;
  titles: JikanTitle[];
  title: string;
  synopsis: string | null;
  images: { jpg: { large_image_url: string | null } };
  year: number | null;
  status: string;
  episodes: number | null;
  genres: { name: string }[];
}

interface JikanEpisode {
  mal_id: number;
  title: string;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getChineseTitle(titles: JikanTitle[]): string | null {
  const chinese = titles.find((t) => t.type === "Chinese");
  if (chinese) return chinese.title;
  return null;
}

async function fetchTopAnime(page = 1): Promise<JikanAnime[]> {
  const res = await fetch(`${API_BASE}/top/anime?page=${page}&limit=25`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.data || [];
}

async function fetchAnimeEpisodes(malId: number): Promise<JikanEpisode[]> {
  const res = await fetch(`${API_BASE}/anime/${malId}/episodes?limit=100`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

const DEMO_VIDEO_URL =
  "https://videos.pexels.com/video-files/37462056/15867807_2560_1440_30fps.mp4";

async function main() {
  console.log("Fetching real anime data from Jikan API...\n");

  const existingTags = await prisma.tag.findMany();
  const tagMap = new Map(existingTags.map((t) => [t.name, t.id]));

  const allGenres = new Set<string>();
  const allAnime: JikanAnime[] = [];

  for (let page = 1; page <= 3; page++) {
    console.log(`Fetching page ${page}...`);
    const animes = await fetchTopAnime(page);
    if (animes.length === 0) break;
    for (const a of animes) {
      for (const g of a.genres) allGenres.add(g.name);
    }
    allAnime.push(...animes);
    await sleep(1000);
  }

  console.log(`\nFetched ${allAnime.length} anime, ${allGenres.size} unique genres`);

  // Create tags with Chinese names
  for (const genreName of allGenres) {
    if (!tagMap.has(genreName)) {
      const zhName = GENRE_ZH[genreName] || genreName;
      const tag = await prisma.tag.create({ data: { name: zhName } });
      tagMap.set(genreName, tag.id);
      console.log(`  Created tag: ${zhName} (${genreName})`);
    }
  }

  // Clear existing data
  console.log("\nClearing existing data...");
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.anime.deleteMany();

  // Import anime
  let createdCount = 0;
  for (const a of allAnime) {
    const status = STATUS_MAP[a.status] || "ONGOING";
    const titleZh = getChineseTitle(a.titles) || a.title;

    const anime = await prisma.anime.create({
      data: {
        title: titleZh,
        originalTitle: a.title,
        cover: a.images.jpg.large_image_url || null,
        description: a.synopsis?.slice(0, 2000) || null,
        releaseYear: a.year || null,
        region: "日本",
        status: status as any,
        totalEpisodes: a.episodes || null,
        tags: {
          connect: a.genres
            .map((g) => tagMap.get(g.name))
            .filter(Boolean)
            .map((id) => ({ id: id! })),
        },
      },
    });

    // Fetch episodes
    await sleep(400);
    const episodes = await fetchAnimeEpisodes(a.mal_id);

    if (episodes.length > 0) {
      await prisma.episode.createMany({
        data: episodes.map((ep, i) => ({
          animeId: anime.id,
          number: ep.mal_id,
          title: ep.title || null,
          isFree: i < 3,
          price: i >= 3 ? 2.99 : 0,
          duration: 24,
          videoUrl: DEMO_VIDEO_URL,
          order: i + 1,
        })),
      });
    } else {
      const epCount = a.episodes || 12;
      await prisma.episode.createMany({
        data: Array.from({ length: Math.min(epCount, 50) }, (_, i) => ({
          animeId: anime.id,
          number: i + 1,
          title: `第${i + 1}话`,
          isFree: i < 3,
          price: i >= 3 ? 2.99 : 0,
          duration: 24,
          videoUrl: DEMO_VIDEO_URL,
          order: i + 1,
        })),
      });
    }

    createdCount++;
    console.log(`  [${createdCount}/${allAnime.length}] ${titleZh}`);
  }

  // Create admin user if missing
  const admin = await prisma.user.findUnique({ where: { email: "admin@animehub.com" } });
  if (!admin) {
    const bcrypt = await import("bcryptjs");
    await prisma.user.create({
      data: {
        email: "admin@animehub.com",
        password: await bcrypt.hash("admin123", 10),
        nickname: "Admin",
        role: "ADMIN",
      },
    });
    console.log("\nCreated admin user: admin@animehub.com / admin123");
  }

  const totalAnime = await prisma.anime.count();
  const totalEpisodes = await prisma.episode.count();
  const totalTags = await prisma.tag.count();

  console.log(`\nDone! Database now has:`);
  console.log(`  ${totalAnime} anime`);
  console.log(`  ${totalEpisodes} episodes`);
  console.log(`  ${totalTags} tags`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
