"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";

interface OrderDetail {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  paidAt: string | null;
  user: { id: string; email: string; nickname: string | null };
  items: {
    id: string;
    price: number;
    anime: { id: string; title: string };
    episode: { id: string; number: number; title: string | null } | null;
  }[];
  payment: {
    id: string;
    method: string;
    tradeNo: string | null;
    amount: number;
    status: string;
    paidAt: string | null;
    createdAt: string;
  } | null;
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refunding, setRefunding] = useState(false);

  const fetchOrder = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`/api/admin/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setOrder(data.order);
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleRefund = async () => {
    if (!confirm("确认对此订单进行退款？")) return;

    const token = localStorage.getItem("token");
    setRefunding(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}/refund`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        fetchOrder();
      }
    } catch {
      alert("退款操作失败");
    } finally {
      setRefunding(false);
    }
  };

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
        <Link href="/admin/orders" className="mb-4 inline-block text-sm text-indigo-600 hover:text-indigo-700">
          &larr; 返回订单列表
        </Link>
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="text-sm text-indigo-600 hover:text-indigo-700">
          &larr; 返回
        </Link>
        <h1 className="text-2xl font-bold text-zinc-800">订单详情</h1>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 grid gap-4 text-sm md:grid-cols-2">
          <div>
            <span className="text-zinc-500">订单号：</span>
            <span className="font-mono text-zinc-800">{order.id}</span>
          </div>
          <div>
            <span className="text-zinc-500">状态：</span>
            <span className="font-medium text-zinc-800">{order.status}</span>
          </div>
          <div>
            <span className="text-zinc-500">用户：</span>
            <Link href={`/admin/users/${order.user.id}`} className="text-indigo-600 hover:text-indigo-700">
              {order.user.nickname || order.user.email}
            </Link>
          </div>
          <div>
            <span className="text-zinc-500">邮箱：</span>
            <span className="text-zinc-800">{order.user.email}</span>
          </div>
          <div>
            <span className="text-zinc-500">总金额：</span>
            <span className="font-medium text-amber-600">¥{Number(order.total).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-zinc-500">创建时间：</span>
            <span className="text-zinc-800">{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          {order.paidAt && (
            <div>
              <span className="text-zinc-500">支付时间：</span>
              <span className="text-zinc-800">{new Date(order.paidAt).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Order items */}
        <h3 className="mb-3 text-sm font-semibold text-zinc-700">购买项目</h3>
        <table className="mb-6 w-full text-left text-sm">
          <thead>
            <tr className="border-b text-zinc-500">
              <th className="px-3 py-2 font-medium">动漫</th>
              <th className="px-3 py-2 font-medium">剧集</th>
              <th className="px-3 py-2 font-medium">价格</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="px-3 py-2 text-zinc-800">{item.anime.title}</td>
                <td className="px-3 py-2 text-zinc-600">
                  {item.episode ? `第${item.episode.number}话${item.episode.title ? ` - ${item.episode.title}` : ""}` : "整部购买"}
                </td>
                <td className="px-3 py-2 font-medium text-zinc-800">¥{Number(item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Payment info */}
        {order.payment && (
          <>
            <h3 className="mb-3 text-sm font-semibold text-zinc-700">支付信息</h3>
            <div className="mb-6 grid gap-4 text-sm md:grid-cols-2">
              <div>
                <span className="text-zinc-500">支付方式：</span>
                <span className="text-zinc-800">{order.payment.method}</span>
              </div>
              <div>
                <span className="text-zinc-500">支付金额：</span>
                <span className="text-zinc-800">¥{Number(order.payment.amount).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-zinc-500">支付状态：</span>
                <span className="text-zinc-800">{order.payment.status}</span>
              </div>
              <div>
                <span className="text-zinc-500">交易号：</span>
                <span className="font-mono text-zinc-800">{order.payment.tradeNo || "-"}</span>
              </div>
              <div>
                <span className="text-zinc-500">支付时间：</span>
                <span className="text-zinc-800">{order.payment.paidAt ? new Date(order.payment.paidAt).toLocaleString() : "-"}</span>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        {order.status === "PAID" && (
          <button
            onClick={handleRefund}
            disabled={refunding}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {refunding ? "处理中..." : "发起退款"}
          </button>
        )}
      </div>
    </div>
  );
}
