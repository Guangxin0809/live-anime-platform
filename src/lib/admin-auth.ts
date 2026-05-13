import { prisma } from "./prisma";
import { getTokenFromHeader, verifyToken } from "./auth";

export async function requireAdmin(authorization: string | null | undefined) {
  const token = getTokenFromHeader(authorization);
  if (!token) return { error: "Unauthorized", status: 401 };

  const payload = verifyToken(token);
  if (!payload) return { error: "Invalid token", status: 401 };

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return { error: "Forbidden", status: 403 };
  }

  return { userId: user.id };
}
