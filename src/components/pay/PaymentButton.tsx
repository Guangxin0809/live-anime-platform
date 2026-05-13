"use client";

import { useState } from "react";

interface PaymentButtonProps {
  orderId: string;
  onSuccess: () => void;
}

export function PaymentButton({ orderId, onSuccess }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("请先登录");

      const res = await fetch(`/api/order/${orderId}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "支付失败");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "支付失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full rounded-lg bg-green-600 py-3 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "支付中..." : "模拟支付"}
      </button>
      <p className="text-center text-xs text-zinc-400">
        ⚡ Mock 模式 — 点击即标记为已支付，不集成真实支付网关
      </p>
    </div>
  );
}
