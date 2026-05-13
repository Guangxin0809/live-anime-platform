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

  const existing = await prisma.anime.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Anime not found" }, { status: 404 });

  const body = await _request.json();
  const { title, originalTitle, cover, description, releaseYear, region, status, totalEpisodes, tags } = body;

  const anime = await prisma.anime.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(originalTitle !== undefined && { originalTitle: originalTitle || null }),
      ...(cover !== undefined && { cover: cover || null }),
      ...(description !== undefined && { description: description || null }),
      ...(releaseYear !== undefined && { releaseYear: releaseYear ? parseInt(releaseYear) : null }),
      ...(region !== undefined && { region: region || null }),
      ...(status !== undefined && { status }),
      ...(totalEpisodes !== undefined && { totalEpisodes: totalEpisodes ? parseInt(totalEpisodes) : null }),
      ...(tags !== undefined && {
        tags: {
          set: [],
          connect: tags.map((tagId: string) => ({ id: tagId })),
        },
      }),
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
      updatedAt: true,
    },
  });

  return NextResponse.json({ anime });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(_request.headers.get("Authorization"));
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { id } = await params;

  const existing = await prisma.anime.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Anime not found" }, { status: 404 });

  await prisma.anime.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
