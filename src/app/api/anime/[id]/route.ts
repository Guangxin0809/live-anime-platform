import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  if (!anime) {
    return NextResponse.json({ error: "Anime not found" }, { status: 404 });
  }

  return NextResponse.json({ anime });
}
