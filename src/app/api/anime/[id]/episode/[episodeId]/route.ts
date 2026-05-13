import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; episodeId: string }> }
) {
  const { id: animeId, episodeId } = await params;

  const episode = await prisma.episode.findUnique({
    where: { id: episodeId },
    select: {
      id: true,
      number: true,
      title: true,
      duration: true,
      isFree: true,
      videoUrl: true,
      anime: { select: { id: true, title: true } },
    },
  });

  if (!episode || episode.anime.id !== animeId) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 });
  }

  if (episode.isFree) {
    return NextResponse.json({
      episode: {
        id: episode.id,
        number: episode.number,
        title: episode.title,
        duration: episode.duration,
        videoUrl: episode.videoUrl,
        anime: episode.anime,
      },
    });
  }

  const token = getTokenFromHeader(_request.headers.get("Authorization"));
  if (!token) return NextResponse.json({ error: "请先登录" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const hasAccess = await prisma.order.findFirst({
    where: {
      userId: payload.userId,
      status: "PAID",
      items: {
        some: {
          animeId,
          OR: [
            { episodeId },
            { episodeId: null },
          ],
        },
      },
    },
    select: { id: true },
  });

  if (!hasAccess) {
    return NextResponse.json({ error: "请先购买后观看" }, { status: 403 });
  }

  return NextResponse.json({
    episode: {
      id: episode.id,
      number: episode.number,
      title: episode.title,
      duration: episode.duration,
      videoUrl: episode.videoUrl,
      anime: episode.anime,
    },
  });
}
