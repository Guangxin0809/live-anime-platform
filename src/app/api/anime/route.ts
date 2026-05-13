import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20")));
  const tag = searchParams.get("tag");

  const where = tag
    ? { tags: { some: { name: tag } } }
    : {};

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

  return NextResponse.json({
    animes,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}
