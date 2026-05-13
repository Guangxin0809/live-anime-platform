"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { OrderStatus } from "@/components/order/OrderStatus";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
  user: { id: string; email: string; nickname: string | null };
  items: { id: string; price: number; anime: { id: string; title: string }; episode: { id: string; number: number; title: string | null } | null }[];
  payment: { id: string; method: string; tradeNo: string | null; amount: number; status: string } | null;
}

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const statusOptions = ["", "PENDING", "PAID", "CANCELLED", "REFUNDING", "REFUNDED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (statusFilter) params.set("status", statusFilter);

    fetch(`/api/admin/orders?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setOrders(data.orders);
          setPagination(data.pagination);
        }
      })
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-800">订单管理</h1>

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === s
                ? "bg-indigo-600 text-white"
                : "bg-white text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            {s || "全部"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg bg-white p-4 shadow-sm">
              <div className="mb-2 h-4 w-48 rounded bg-zinc-200" />
              <div className="h-3 w-32 rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center text-zinc-400">暂无订单</div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-zinc-500">
                  <th className="px-4 py-3 font-medium">订单号</th>
                  <th className="px-4 py-3 font-medium">用户</th>
                  <th className="px-4 py-3 font-medium">金额</th>
                  <th className="px-4 py-3 font-medium">状态</th>
                  <th className="px-4 py-3 font-medium">时间</th>
                  <th className="px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-zinc-50">
                    <td className="px-4 py-3 font-mono text-xs text-zinc-600">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-zinc-800">{order.user.nickname || order.user.email}</div>
                      <div className="text-xs text-zinc-400">{order.user.email}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-800">
                      ¥{Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatus status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        详情
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block rounded-lg bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-mono text-xs text-zinc-400">
                    {order.id.slice(0, 8)}...
                  </span>
                  <OrderStatus status={order.status} />
                </div>
                <div className="mb-1 text-sm font-medium text-zinc-800">
                  {order.user.nickname || order.user.email}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-600 font-medium">
                    ¥{Number(order.total).toFixed(2)}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 hover:bg-white disabled:opacity-50"
              >
                上一页
              </button>
              <span className="text-sm text-zinc-500">
                {page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="rounded-lg px-3 py-1.5 text-sm text-zinc-600 hover:bg-white disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
