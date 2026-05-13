import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = getTokenFromHeader(request.headers.get("Authorization"));
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const animeId = searchParams.get("animeId");

  if (!animeId) {
    return NextResponse.json({ error: "animeId is required" }, { status: 400 });
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: payload.userId,
      status: "PAID",
      items: { some: { animeId } },
    },
    select: {
      items: {
        select: { episodeId: true },
      },
    },
  });

  const episodeIds: string[] = [];
  let wholeAnime = false;

  for (const order of orders) {
    for (const item of order.items) {
      if (item.episodeId) {
        episodeIds.push(item.episodeId);
      } else {
        wholeAnime = true;
      }
    }
  }

  return NextResponse.json({ episodeIds, wholeAnime });
}
