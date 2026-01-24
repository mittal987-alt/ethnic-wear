"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "../../../../services/api";

interface Order {
  _id: string;
  user: { name: string; email: string };
  items: {
    title: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminOrderDetailsPage() {
  const { id } = useParams() as { id: string };
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    API.get(`/orders/${id}`).then((res) =>
      setOrder(res.data)
    );
  }, [id]);

  if (!order) return <p className="p-10">Loading order...</p>;

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">
        Order Details
      </h1>

      {/* USER */}
      <div className="mb-6">
        <p><b>User:</b> {order.user.name}</p>
        <p><b>Email:</b> {order.user.email}</p>
        <p><b>Status:</b> {order.status}</p>
        <p>
          <b>Date:</b>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* ITEMS */}
      <div className="space-y-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex gap-4 border-b pb-3">
            {item.image && (
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`}
                className="h-16 w-14 object-cover rounded"
              />
            )}

            <div className="flex-1">
              <p>{item.title}</p>
              <p className="text-sm text-gray-500">
                ₹{item.price} × {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="text-right mt-6 font-medium">
        Total: ₹{order.totalAmount}
      </div>
    </main>
  );
}
