"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OrderTable } from "@/components/order/OrderTable";

const TABS = [
  { label: "全部", value: "" },
  { label: "待支付", value: "PENDING" },
  { label: "已支付", value: "PAID" },
  { label: "已取消", value: "CANCELLED" },
];

function OrderListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentStatus = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") ?? "1");

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState<{
    page: number;
    totalPages: number;
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const params = new URLSearchParams();
      if (currentStatus) params.set("status", currentStatus);
      params.set("page", String(page));

      const res = await fetch(`/api/order?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders ?? []);
      setPagination(data.pagination ?? null);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentStatus, page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function handleTabChange(status: string) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    router.push(`/order?${params.toString()}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">订单列表</h1>

      <div className="mb-6 flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              currentStatus === tab.value
                ? "bg-indigo-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-zinc-400">加载中...</div>
      ) : (
        <>
          <OrderTable orders={orders} />

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", String(pagination.page - 1));
                  router.push(`/order?${params.toString()}`);
                }}
                disabled={pagination.page <= 1}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40"
              >
                上一页
              </button>
              <span className="text-sm text-zinc-500">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("page", String(pagination.page + 1));
                  router.push(`/order?${params.toString()}`);
                }}
                disabled={pagination.page >= pagination.totalPages}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40"
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

export default function OrderListPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="container mx-auto px-4 py-8 text-center text-zinc-400">加载中...</div>}>
        <OrderListContent />
      </Suspense>
    </ProtectedRoute>
  );
}
