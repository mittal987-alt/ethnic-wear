"use client";

import { useEffect, useState } from "react";
import API from "../../services/api";
import OrderTracking from "@/component/OrderTracking";

/* ================= TYPES ================= */

interface OrderItem {
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface TimelineItem {
  status: string;
  date: string;
}

interface ReturnRequest {
  requested: boolean;
  type?: "RETURN" | "REPLACE";
  reason?: string;
  status?: "Pending" | "Approved" | "Rejected";
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;

  timeline?: TimelineItem[];
  courier?: string;
  trackingNumber?: string;
  expectedDelivery?: string;

  returnRequest?: ReturnRequest;
}

/* ================= PAGE ================= */

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my");
      setOrders(res.data.orders ?? res.data);
    } catch (err) {
      console.error(err);
      alert("Please login to view orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId: string) => {
    try {
      const res = await API.put(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data : o))
      );
    } catch (err) {
      console.error(err);
      alert("Unable to cancel order");
    }
  };

  if (loading) return <p className="p-10">Loading orders...</p>;

  if (orders.length === 0) {
    return (
      <main className="p-10 text-center">
        <h2 className="text-xl font-medium">No orders yet</h2>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-6">

            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-mono text-sm">{order._id}</p>
              </div>

              <div className="text-right">
                <p className="text-sm">
                  Status: <span className="font-medium">{order.status}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* ITEMS */}
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  {item.image && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}

                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* TRACKING */}
            {order.courier && (
              <div className="mt-4 text-sm">
                🚚 <b>{order.courier}</b> — Tracking:{" "}
                <span className="font-mono">{order.trackingNumber}</span>
              </div>
            )}

            {order.expectedDelivery && (
              <p className="text-sm text-gray-500 mt-1">
                Expected delivery:{" "}
                {new Date(order.expectedDelivery).toDateString()}
              </p>
            )}

            {/* TIMELINE */}
            {order.timeline && (
              <div className="mt-6">
                <OrderTracking timeline={order.timeline} />
              </div>
            )}

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-6">
              <p className="font-semibold">Total: ₹{order.totalAmount}</p>

              <div className="flex gap-3">
                <button
                  disabled={
                    order.status === "Delivered" ||
                    order.status === "Cancelled"
                  }
                  onClick={() => cancelOrder(order._id)}
                  className={`px-4 py-2 text-sm rounded ${
                    order.status === "Delivered" ||
                    order.status === "Cancelled"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-600 text-white"
                  }`}
                >
                  Cancel
                </button>

                {order.status === "Delivered" &&
                  !order.returnRequest?.requested && (
                    <button
                      onClick={async () => {
                        const reason = prompt("Reason for return / replace?");
                        if (!reason) return;

                        const type = confirm(
                          "OK = RETURN | Cancel = REPLACE"
                        )
                          ? "RETURN"
                          : "REPLACE";

                        const res = await API.post(
                          `/orders/${order._id}/return`,
                          { type, reason }
                        );

                        setOrders((prev) =>
                          prev.map((o) =>
                            o._id === order._id ? res.data : o
                          )
                        );
                      }}
                      className="bg-orange-600 text-white px-4 py-2 text-sm rounded"
                    >
                      Return / Replace
                    </button>
                  )}
              </div>
            </div>

            {/* RETURN STATUS */}
            {order.returnRequest?.requested && (
              <p className="mt-2 text-sm text-orange-600">
                Return Request: {order.returnRequest.status}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}