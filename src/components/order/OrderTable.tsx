import Link from "next/link";
import { OrderStatus } from "./OrderStatus";

interface OrderItemSummary {
  id: string;
  price: number;
  anime: { id: string; title: string };
  episode: { id: string; number: number; title: string | null } | null;
}

interface OrderRow {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItemSummary[];
}

export function OrderTable({ orders }: { orders: OrderRow[] }) {
  if (orders.length === 0) {
    return (
      <div className="py-16 text-center text-zinc-400">暂无订单</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-left text-zinc-500">
            <th className="pb-3 font-medium">商品</th>
            <th className="pb-3 font-medium">金额</th>
            <th className="pb-3 font-medium">状态</th>
            <th className="pb-3 font-medium">时间</th>
            <th className="pb-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-zinc-100">
              <td className="py-4">
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      <span className="text-zinc-800">{item.anime.title}</span>
                      {item.episode && (
                        <span className="ml-2 text-zinc-400">
                          第{item.episode.number}话
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </td>
              <td className="py-4 font-medium text-zinc-800">
                ¥{Number(order.total).toFixed(2)}
              </td>
              <td className="py-4">
                <OrderStatus status={order.status} />
              </td>
              <td className="py-4 text-zinc-500">
                {new Date(order.createdAt).toLocaleDateString("zh-CN")}
              </td>
              <td className="py-4">
                <Link
                  href={`/order/${order.id}`}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  查看
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
