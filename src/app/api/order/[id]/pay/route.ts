import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokenFromHeader, verifyToken } from "@/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getTokenFromHeader(_request.headers.get("Authorization"));
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    select: { id: true, userId: true, status: true, total: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.userId !== payload.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (order.status !== "PENDING") {
    return NextResponse.json({ error: "Order is not pending" }, { status: 400 });
  }

  const tradeNo = `MOCK${Date.now()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: "PAID",
      paidAt: new Date(),
      payment: {
        create: {
          method: "ALIPAY",
          tradeNo,
          amount: order.total,
          status: "SUCCESS",
          paidAt: new Date(),
        },
      },
    },
    select: {
      id: true,
      status: true,
      total: true,
      paidAt: true,
      payment: {
        select: {
          id: true,
          method: true,
          tradeNo: true,
          amount: true,
          status: true,
          paidAt: true,
        },
      },
    },
  });

  return NextResponse.json({ order: updated });
}
