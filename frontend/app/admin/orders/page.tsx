"use client";

import { useEffect, useState } from "react";
import API from "../../../services/api";

interface ReturnRequest {
  requested: boolean;
  type: string;
  reason: string;
  status: string;
}

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
  returnRequest?: ReturnRequest;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  // ✅ reusable state updater
  const updateOrder = (updated: Order) => {
    setOrders(prev =>
      prev.map(o => (o._id === updated._id ? updated : o))
    );
  };

  // ✅ status update
  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await API.put(`/orders/${id}/status`, { status });
      updateOrder(res.data);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // ✅ return decision
  const handleReturnDecision = async (
    id: string,
    decision: "Approved" | "Rejected"
  ) => {
    try {
      const res = await API.put(
        `/orders/${id}/return/decision`,
        { decision }
      );
      updateOrder(res.data);
    } catch (err) {
      console.error("Return decision failed", err);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      <div className="space-y-4">

        {orders.map(order => (
          <div
            key={order._id}
            className="border p-4 rounded flex flex-col md:flex-row justify-between gap-4"
          >
            <div>
              <p className="font-mono text-sm">{order._id}</p>
              <p>₹{order.totalAmount}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(order._id, e.target.value)
              }
              className="border px-3 py-2 rounded"
            >
              <option>Placed</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>

            {/* ✅ RETURN REQUEST BLOCK */}
            {order.returnRequest?.requested && (
              <div className="mt-3 p-3 border rounded bg-orange-50 w-full md:w-auto">
                <p className="font-medium text-orange-700">
                  Return Request ({order.returnRequest.type})
                </p>
                <p className="text-sm">
                  Reason: {order.returnRequest.reason}
                </p>
                <p className="text-sm">
                  Status: {order.returnRequest.status}
                </p>
                


                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() =>
                      handleReturnDecision(order._id, "Approved")
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleReturnDecision(order._id, "Rejected")
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

      </div>
    </main>
  );
}