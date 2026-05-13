import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request.headers.get("Authorization"));
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [animeCount, orderCount, todayOrderCount, userCount, revenue] = await Promise.all([
    prisma.anime.count(),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { total: true },
    }),
  ]);

  const statusCounts = await prisma.order.groupBy({
    by: ["status"],
    _count: { id: true },
  });

  return NextResponse.json({
    animeCount,
    orderCount,
    todayOrderCount,
    userCount,
    revenue: Number(revenue._sum.total ?? 0),
    orderStatusCounts: statusCounts.reduce(
      (acc, cur) => ({ ...acc, [cur.status]: cur._count.id }),
      {} as Record<string, number>,
    ),
  });
}
