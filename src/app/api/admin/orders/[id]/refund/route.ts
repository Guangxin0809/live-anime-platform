import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(_request.headers.get("Authorization"));
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status !== "PAID") return NextResponse.json({ error: "Order must be PAID to refund" }, { status: 400 });

  await prisma.order.update({
    where: { id },
    data: {
      status: "REFUNDED",
      payment: {
        update: { status: "REFUND" },
      },
    },
  });

  return NextResponse.json({ success: true });
}
