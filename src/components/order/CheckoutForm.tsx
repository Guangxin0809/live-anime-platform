"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CheckoutItem {
  animeId: string;
  animeTitle: string;
  episodeId: string | null;
  episodeNumber: number | null;
  episodeTitle: string | null;
  price: number;
}

export function CheckoutForm({ item }: { item: CheckoutItem }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          animeId: item.animeId,
          episodeId: item.episodeId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "创建订单失败");
      }

      router.push(`/order/${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建订单失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-zinc-200 p-4">
        <h3 className="font-medium text-zinc-800">{item.animeTitle}</h3>
        {item.episodeNumber && (
          <p className="mt-1 text-sm text-zinc-500">
            第{item.episodeNumber}话 {item.episodeTitle || ""}
          </p>
        )}
        <p className="mt-3 text-lg font-bold text-zinc-900">
          ¥{item.price.toFixed(2)}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "提交中..." : "提交订单"}
      </button>
    </div>
  );
}
