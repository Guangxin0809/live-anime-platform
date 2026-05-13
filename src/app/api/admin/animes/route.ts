import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request.headers.get("Authorization"));
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = request.nextUrl;
  const keyword = searchParams.get("keyword")?.trim() || "";
  const status = searchParams.get("status")?.trim() || "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20")));

  const where: Record<string, unknown> = {};
  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { originalTitle: { contains: keyword, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;

  const [animes, total] = await Promise.all([
    prisma.anime.findMany({
      where,
      select: {
        id: true,
        title: true,
        originalTitle: true,
        cover: true,
        status: true,
        totalEpisodes: true,
        releaseYear: true,
        createdAt: true,
        tags: { select: { id: true, name: true } },
        _count: { select: { episodes: true, orderItems: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.anime.count({ where }),
  ]);

  return NextResponse.json({
    animes,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request.headers.get("Authorization"));
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { title, originalTitle, cover, description, releaseYear, region, status, totalEpisodes, tags } = body;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const anime = await prisma.anime.create({
    data: {
      title,
      originalTitle: originalTitle || null,
      cover: cover || null,
      description: description || null,
      releaseYear: releaseYear ? parseInt(releaseYear) : null,
      region: region || null,
      status: status || "ONGOING",
      totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : null,
      tags: Array.isArray(tags) && tags.length > 0
        ? { connect: tags.map((id: string) => ({ id })) }
        : undefined,
    },
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
      tags: { select: { id: true, name: true } },
      createdAt: true,
    },
  });

  return NextResponse.json({ anime }, { status: 201 });
}
