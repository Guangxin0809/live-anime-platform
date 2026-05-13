import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(_request.headers.get("Authorization"));
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      nickname: true,
      avatar: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { orders: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const [orderCounts, totalSpent] = await Promise.all([
    prisma.order.groupBy({
      by: ["status"],
      where: { userId: id },
      _count: { id: true },
    }),
    prisma.order.aggregate({
      where: { userId: id, status: "PAID" },
      _sum: { total: true },
    }),
  ]);

  return NextResponse.json({
    user,
    stats: {
      orderCounts: orderCounts.reduce(
        (acc, cur) => ({ ...acc, [cur.status]: cur._count.id }),
        {} as Record<string, number>,
      ),
      totalSpent: Number(totalSpent._sum.total ?? 0),
    },
  });
}
