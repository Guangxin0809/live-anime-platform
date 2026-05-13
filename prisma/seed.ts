import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TAGS = [
  "热血",
  "冒险",
  "科幻",
  "奇幻",
  "搞笑",
  "恋爱",
  "悬疑",
  "日常",
  "战斗",
  "校园",
  "机甲",
  "历史",
];

interface SeedAnime {
  title: string;
  originalTitle: string;
  description: string;
  releaseYear: number;
  region: string;
  status: "ONGOING" | "FINISHED" | "UPCOMING";
  totalEpisodes: number;
  tags: string[];
  episodes: { number: number; title: string }[];
}

const ANIME_DATA: SeedAnime[] = [
  {
    title: "星际迷航",
    originalTitle: "Star Odyssey",
    description:
      "在遥远的未来，人类已经遍布银河系。年轻的宇航员杰克在一次常规巡逻中发现了外星文明的遗迹，从此卷入了一场跨越星系的巨大阴谋。",
    releaseYear: 2023,
    region: "日本",
    status: "ONGOING",
    totalEpisodes: 24,
    tags: ["科幻", "冒险", "战斗"],
    episodes: Array.from({ length: 24 }, (_, i) => ({
      number: i + 1,
      title: i === 0 ? "启程" : `第${i + 1}话`,
    })),
  },
  {
    title: "剑与魔法",
    originalTitle: "Sword & Magic",
    description:
      "一个普通的高中生被召唤到异世界，在那里他必须学会使用剑与魔法，带领新的伙伴们对抗魔王军的入侵。",
    releaseYear: 2024,
    region: "日本",
    status: "ONGOING",
    totalEpisodes: 12,
    tags: ["奇幻", "冒险", "热血"],
    episodes: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      title: i === 0 ? "异世界召唤" : `第${i + 1}话`,
    })),
  },
  {
    title: "樱花下的誓言",
    originalTitle: "Promise Under Sakura",
    description:
      "从小一起长大的青梅竹马，在高中最后一年面临着各自人生的选择。当梦想与现实冲突时，他们之间的感情将何去何从？",
    releaseYear: 2023,
    region: "日本",
    status: "FINISHED",
    totalEpisodes: 12,
    tags: ["恋爱", "校园", "日常"],
    episodes: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      title: `第${i + 1}话`,
    })),
  },
  {
    title: "侦探事务所",
    originalTitle: "Detective Agency",
    description:
      "在繁华都市的角落，一家不起眼的侦探事务所里，天才侦探和她的助手们揭开一个个离奇的案件。每个案件背后，都隐藏着人性的秘密。",
    releaseYear: 2024,
    region: "日本",
    status: "ONGOING",
    totalEpisodes: 24,
    tags: ["悬疑", "日常"],
    episodes: Array.from({ length: 24 }, (_, i) => ({
      number: i + 1,
      title: `案件 #${i + 1}`,
    })),
  },
  {
    title: "机甲战士",
    originalTitle: "Mech Warrior",
    description:
      "公元2200年，地球遭到外星生物的入侵。人类最后的希望寄托在一群年轻的机甲驾驶员身上，他们必须学会驾驶最先进的机甲，保卫人类的家园。",
    releaseYear: 2022,
    region: "日本",
    status: "FINISHED",
    totalEpisodes: 48,
    tags: ["机甲", "科幻", "战斗"],
    episodes: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      title: `Act ${i + 1}`,
    })),
  },
  {
    title: "忍者传说",
    originalTitle: "Ninja Legend",
    description:
      "战国时代，一个年轻的忍者继承了传说中的忍术，在乱世中寻找自己的道路。面对强大的敌人和复杂的政治斗争，他必须做出艰难的选择。",
    releaseYear: 2024,
    region: "日本",
    status: "ONGOING",
    totalEpisodes: 24,
    tags: ["热血", "战斗", "历史"],
    episodes: Array.from({ length: 24 }, (_, i) => ({
      number: i + 1,
      title: `第${i + 1}章`,
    })),
  },
  {
    title: "咖啡屋物语",
    originalTitle: "Coffee Shop Stories",
    description:
      "在一家街角的咖啡屋里，每天都有不同的客人到来。店主通过一杯杯咖啡，倾听着客人们的故事，也治愈着他们的心灵。",
    releaseYear: 2023,
    region: "日本",
    status: "FINISHED",
    totalEpisodes: 12,
    tags: ["日常", "搞笑"],
    episodes: Array.from({ length: 12 }, (_, i) => ({
      number: i + 1,
      title: `第${i + 1}杯`,
    })),
  },
  {
    title: "龙之传说",
    originalTitle: "Dragon Saga",
    description:
      "在一个龙与人类共存的世界里，一个被龙抚养长大的少年踏上了寻找自己身世之谜的旅程。途中他遇到了各种各样的伙伴，也揭开了远古的秘密。",
    releaseYear: 2025,
    region: "日本",
    status: "UPCOMING",
    totalEpisodes: 0,
    tags: ["奇幻", "冒险"],
    episodes: [],
  },
];

async function main() {
  console.log("Seeding database...");

  // Create tags
  const tagRecords: Record<string, string> = {};
  for (const name of TAGS) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tagRecords[name] = tag.id;
  }
  console.log(`Created ${TAGS.length} tags.`);

  // Create admin user
  const bcrypt = await import("bcryptjs");
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@animehub.com" },
    update: {},
    create: {
      email: "admin@animehub.com",
      password: adminPassword,
      nickname: "管理员",
      role: "ADMIN",
    },
  });
  console.log("Created admin user (admin@animehub.com / admin123).");

  // Create anime with episodes and tags
  for (const anime of ANIME_DATA) {
    const created = await prisma.anime.create({
      data: {
        title: anime.title,
        originalTitle: anime.originalTitle,
        description: anime.description,
        releaseYear: anime.releaseYear,
        region: anime.region,
        status: anime.status as any,
        totalEpisodes: anime.totalEpisodes,
        tags: {
          connect: anime.tags.map((name) => ({ id: tagRecords[name] })),
        },
        episodes: {
          create: anime.episodes.map((ep) => ({
            number: ep.number,
            title: ep.title,
            isFree: ep.number <= 3, // First 3 episodes free
            price: ep.number > 3 ? 2.99 : 0,
            videoUrl: "https://videos.pexels.com/video-files/37462056/15867807_2560_1440_30fps.mp4",
            order: ep.number,
          })),
        },
      },
    });
    console.log(
      `  Created anime: ${created.title} (${anime.episodes.length} episodes)`
    );
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
