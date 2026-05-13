import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = getTokenFromHeader(request.headers.get("Authorization"));
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  try {
    const { animeId, episodeId } = await request.json();

    if (!animeId) {
      return NextResponse.json({ error: "animeId is required" }, { status: 400 });
    }

    const anime = await prisma.anime.findUnique({
      where: { id: animeId },
      select: { id: true, title: true },
    });
    if (!anime) {
      return NextResponse.json({ error: "Anime not found" }, { status: 404 });
    }

    let price = 0;

    if (episodeId) {
      const ep = await prisma.episode.findUnique({
        where: { id: episodeId },
        select: { isFree: true, price: true },
      });
      if (!ep) {
        return NextResponse.json({ error: "Episode not found" }, { status: 404 });
      }
      price = ep.isFree ? 0 : Number(ep.price ?? 0);
    } else {
      // Purchase entire anime — sum all non-free episodes
      const episodes = await prisma.episode.findMany({
        where: { animeId, isFree: false },
        select: { price: true },
      });
      price = episodes.reduce((sum, ep) => sum + Number(ep.price ?? 0), 0);
    }

    const order = await prisma.order.create({
      data: {
        userId: payload.userId,
        total: price,
        items: {
          create: {
            animeId: anime.id,
            episodeId: episodeId || null,
            price,
          },
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const token = getTokenFromHeader(request.headers.get("Authorization"));
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status")?.trim() || "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") ?? "20")));

  const where: Record<string, unknown> = { userId: payload.userId };
  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        paidAt: true,
        items: {
          select: {
            id: true,
            price: true,
            anime: { select: { id: true, title: true } },
            episode: { select: { id: true, number: true, title: true } },
          },
        },
        payment: {
          select: {
            id: true,
            method: true,
            tradeNo: true,
            amount: true,
            status: true,
            paidAt: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({
    orders,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
}
