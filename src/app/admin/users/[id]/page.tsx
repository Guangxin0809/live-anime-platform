"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";

interface UserDetail {
  user: {
    id: string;
    email: string;
    nickname: string | null;
    avatar: string | null;
    phone: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
    _count: { orders: number };
  };
  stats: {
    orderCounts: Record<string, number>;
    totalSpent: number;
  };
}

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Failed to load user"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-zinc-200" />
        <div className="h-48 animate-pulse rounded-xl bg-white shadow-sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link href="/admin/users" className="mb-4 inline-block text-sm text-indigo-600 hover:text-indigo-700">
          &larr; 返回用户列表
        </Link>
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  const { user, stats } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="text-sm text-indigo-600 hover:text-indigo-700">
          &larr; 返回
        </Link>
        <h1 className="text-2xl font-bold text-zinc-800">用户详情</h1>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 grid gap-4 text-sm md:grid-cols-2">
          <div>
            <span className="text-zinc-500">邮箱：</span>
            <span className="text-zinc-800">{user.email}</span>
          </div>
          <div>
            <span className="text-zinc-500">昵称：</span>
            <span className="text-zinc-800">{user.nickname || "-"}</span>
          </div>
          <div>
            <span className="text-zinc-500">角色：</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-zinc-100 text-zinc-600"
            }`}>
              {user.role}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">手机：</span>
            <span className="text-zinc-800">{user.phone || "-"}</span>
          </div>
          <div>
            <span className="text-zinc-500">注册时间：</span>
            <span className="text-zinc-800">{new Date(user.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-zinc-500">总订单数：</span>
            <span className="text-zinc-800">{user._count.orders}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-zinc-800">消费统计</h2>
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <span className="text-zinc-500">总消费金额：</span>
            <span className="font-medium text-amber-600">¥{stats.totalSpent.toFixed(2)}</span>
          </div>
          <div />
          {Object.entries(stats.orderCounts).map(([status, count]) => (
            <div key={status}>
              <span className="text-zinc-500">{status} 订单：</span>
              <span className="text-zinc-800">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
