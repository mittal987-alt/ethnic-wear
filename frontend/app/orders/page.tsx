"use client";

import { useEffect, useState } from "react";
import API from "../../services/api";

interface OrderItem {
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  returnRequest?: {
    requested: boolean;
    type?: "RETURN" | "REPLACE";
    reason?: string;
    status?: "Pending" | "Approved" | "Rejected";
  };
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my");
        setOrders(res.data);
      } catch {
        alert("Please login to view orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (orderId: string) => {
    try {
      const res = await API.put(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data : o))
      );
    } catch {
      alert("Unable to cancel order");
    }
  };

  if (loading) {
    return <p className="p-10">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <main className="p-10 text-center">
        <h2 className="text-xl font-medium">No orders yet</h2>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded p-5">
            {/* HEADER */}
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-sm">{order._id}</p>
              </div>

              <div className="text-right">
                <p className="text-sm">
                  Status:{" "}
                  <span className="font-medium">{order.status}</span>
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* ITEMS */}
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`}
                      alt={item.title}
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

            {/* FOOTER */}
            <div className="flex justify-between items-center mt-4">
              <p className="font-medium">
                Total: ₹{order.totalAmount}
              </p>

              <div className="flex gap-3">
                {/* CANCEL */}
                <button
                  disabled={
                    order.status === "Delivered" ||
                    order.status === "Cancelled"
                  }
                  onClick={() => cancelOrder(order._id)}
                  className={`text-sm px-4 py-2 rounded ${
                    order.status === "Delivered" ||
                    order.status === "Cancelled"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-600 text-white"
                  }`}
                >
                  Cancel
                </button>

                {/* RETURN / REPLACE */}
                {order.status === "Delivered" &&
                  !order.returnRequest?.requested && (
                    <button
                      onClick={async () => {
                        const reason = prompt(
                          "Reason for return / replace?"
                        );
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
                      className="bg-orange-600 text-white text-sm px-4 py-2 rounded"
                    >
                      Return / Replace
                    </button>
                  )}
              </div>
            </div>

            {/* ORDER TIMELINE */}
            <OrderTimeline status={order.status} />

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


/* 🔹 ORDER TIMELINE */
function OrderTimeline({ status }: { status: string }) {
  const steps = ["Placed", "Processing", "Shipped", "Delivered"];

  return (
    <div className="flex justify-between mt-4 text-xs">
      {steps.map((step) => {
        const active = steps.indexOf(step) <= steps.indexOf(status);
        return (
          <div
            key={step}
            className={`flex-1 text-center ${
              active ? "text-green-600" : "text-gray-400"
            }`}
          >
            <div className="w-2 h-2 mx-auto mb-1 rounded-full bg-current" />
            {step}
          </div>
        );
      })}
    </div>
  );
}
