"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900">个人资料</h1>

      <div className="space-y-4 rounded-lg border border-zinc-200 p-6">
        <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
            {(user.nickname || user.email)[0].toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-medium text-zinc-900">
              {user.nickname || "未设置昵称"}
            </p>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </div>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">邮箱</dt>
            <dd className="text-zinc-900">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">昵称</dt>
            <dd className="text-zinc-900">{user.nickname || "未设置"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-zinc-500">角色</dt>
            <dd className="text-zinc-900">
              {user.role === "ADMIN" ? "管理员" : "用户"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
