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
  const order = await prisma.order.findUnique({
    where: { id },
    select: {
      id: true,
      total: true,
      status: true,
      createdAt: true,
      paidAt: true,
      user: { select: { id: true, email: true, nickname: true } },
      items: {
        select: {
          id: true,
          price: true,
          anime: { select: { id: true, title: true } },
          episode: { select: { id: true, number: true, title: true } },
        },
      },
      payment: {
        select: { id: true, method: true, tradeNo: true, amount: true, status: true, paidAt: true, createdAt: true },
      },
    },
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ order });
}
