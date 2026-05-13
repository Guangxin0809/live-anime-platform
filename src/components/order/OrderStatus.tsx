const STATUS_MAP: Record<string, { label: string; style: string }> = {
  PENDING: { label: "待支付", style: "bg-amber-100 text-amber-700" },
  PAID: { label: "已支付", style: "bg-green-100 text-green-700" },
  CANCELLED: { label: "已取消", style: "bg-zinc-100 text-zinc-500" },
  REFUNDING: { label: "退款中", style: "bg-blue-100 text-blue-700" },
  REFUNDED: { label: "已退款", style: "bg-purple-100 text-purple-700" },
};

export function OrderStatus({ status }: { status: string }) {
  const info = STATUS_MAP[status] ?? { label: status, style: "bg-zinc-100 text-zinc-600" };

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${info.style}`}>
      {info.label}
    </span>
  );
}
