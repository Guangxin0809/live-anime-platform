"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  animeCount: number;
  orderCount: number;
  todayOrderCount: number;
  userCount: number;
  revenue: number;
  orderStatusCounts: Record<string, number>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStats(data);
      })
      .catch(() => setError("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-800">仪表盘</h1>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-2 h-4 w-20 rounded bg-zinc-200" />
              <div className="h-8 w-16 rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-800">仪表盘</h1>
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: "动漫总数", value: stats.animeCount, href: "/admin/animes", color: "text-blue-600" },
    { label: "订单总数", value: stats.orderCount, href: "/admin/orders", color: "text-green-600" },
    { label: "用户总数", value: stats.userCount, href: "/admin/users", color: "text-purple-600" },
    { label: "总收入", value: `¥${stats.revenue.toFixed(2)}`, href: "", color: "text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-800">仪表盘</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) =>
          card.href ? (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-1 text-sm text-zinc-500">{card.label}</div>
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            </Link>
          ) : (
            <div
              key={card.label}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="mb-1 text-sm text-zinc-500">{card.label}</div>
              <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            </div>
          )
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-800">订单状态分布</h2>
          <div className="space-y-3">
            {Object.entries(stats.orderStatusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-zinc-600">{status}</span>
                <span className="text-sm font-medium text-zinc-800">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-zinc-800">今日数据</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-600">今日新增订单</span>
              <span className="text-sm font-medium text-zinc-800">{stats.todayOrderCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
