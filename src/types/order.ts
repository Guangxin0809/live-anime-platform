export interface OrderItem {
  id: string;
  orderId: string;
  animeId: string;
  animeTitle: string;
  episodeId: string | null;
  episodeNumber: number | null;
  episodeTitle: string | null;
  price: number;
}

export interface Payment {
  id: string;
  orderId: string;
  method: string;
  tradeNo: string | null;
  amount: number;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: "PENDING" | "PAID" | "CANCELLED" | "REFUNDING" | "REFUNDED";
  items: OrderItem[];
  payment: Payment | null;
  createdAt: string;
  paidAt: string | null;
}
