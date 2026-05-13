"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OrderStatus } from "@/components/order/OrderStatus";
import { PaymentButton } from "@/components/pay/PaymentButton";

interface OrderItemData {
  id: string;
  price: number;
  anime: { id: string; title: string };
  episode: { id: string; number: number; title: string | null } | null;
}

interface PaymentData {
  id: string;
  method: string;
  tradeNo: string | null;
  amount: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

interface OrderData {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
  items: OrderItemData[];
  payment: PaymentData | null;
}

function OrderDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchOrder() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const res = await fetch(`/api/order/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "获取订单失败");
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取订单失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="py-24 text-center text-zinc-400">加载中...</div>;
  }

  if (error) {
    return <div className="py-24 text-center text-red-500">{error}</div>;
  }

  if (!order) {
    return <div className="py-24 text-center text-zinc-400">订单不存在</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">订单详情</h1>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
          <span className="text-sm text-zinc-500">订单编号</span>
          <span className="font-mono text-sm text-zinc-800">{order.id}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
          <span className="text-sm text-zinc-500">状态</span>
          <OrderStatus status={order.status} />
        </div>

        <div className="rounded-lg border border-zinc-200 p-4">
          <h3 className="mb-3 text-sm font-medium text-zinc-500">商品信息</h3>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2">
              <div>
                <span className="text-zinc-800">{item.anime.title}</span>
                {item.episode && (
                  <span className="ml-2 text-sm text-zinc-400">
                    第{item.episode.number}话 {item.episode.title || ""}
                  </span>
                )}
              </div>
              <span className="font-medium text-zinc-800">
                ¥{Number(item.price).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-zinc-100 pt-3">
            <span className="font-medium text-zinc-800">合计</span>
            <span className="text-lg font-bold text-zinc-900">
              ¥{Number(order.total).toFixed(2)}
            </span>
          </div>
        </div>

        {order.status === "PAID" && order.payment && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-green-800">支付信息</h3>
            <div className="space-y-1 text-sm text-green-700">
              <p>交易号：{order.payment.tradeNo}</p>
              <p>支付方式：{order.payment.method === "ALIPAY" ? "支付宝" : "微信支付"}</p>
              <p>支付时间：{order.payment.paidAt ? new Date(order.payment.paidAt).toLocaleString("zh-CN") : ""}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
          <span className="text-sm text-zinc-500">创建时间</span>
          <span className="text-sm text-zinc-700">
            {new Date(order.createdAt).toLocaleString("zh-CN")}
          </span>
        </div>

        {order.status === "PENDING" && (
          <PaymentButton
            orderId={order.id}
            onSuccess={() => {
              const firstItem = order.items[0];
              if (firstItem?.episode) {
                router.replace(`/anime/${firstItem.anime.id}/episode/${firstItem.episode.id}`);
              } else if (firstItem) {
                router.replace(`/anime/${firstItem.anime.id}`);
              } else {
                router.replace("/order");
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <ProtectedRoute>
      <OrderDetailContent id={id} />
    </ProtectedRoute>
  );
}
