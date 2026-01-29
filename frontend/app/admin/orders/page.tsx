"use client";

import { useEffect, useState } from "react";
import API from "../../../services/api";

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  } | null;
  totalAmount: number;
  status: string;
  paymentMethod: "COD" | "RAZORPAY";
  paymentStatus: "Pending" | "Paid" | "Refunded";
  returnRequest?: {
    requested: boolean;
    type?: "RETURN" | "REPLACE";
    reason?: string;
    status?: "Pending" | "Approved" | "Rejected";
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  /* =========================
     FETCH ORDERS
  ========================= */
  useEffect(() => {
    API.get("/orders").then((res) => setOrders(res.data));
  }, []);

  /* =========================
     UPDATE STATUS
  ========================= */
  const updateStatus = async (id: string, status: string) => {
    const res = await API.put(`/orders/${id}/status`, { status });
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? res.data : o))
    );
  };

  /* =========================
     CANCEL ORDER
  ========================= */
  const cancelOrder = async (id: string) => {
    const res = await API.put(`/orders/${id}/cancel`);
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? res.data : o))
    );
  };

  /* =========================
     REFUND ORDER
  ========================= */
  const refundOrder = async (id: string) => {
    if (!confirm("Refund this order?")) return;

    try {
      const res = await API.post(`/orders/${id}/refund`);
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? res.data : o))
      );
      alert("Refund successful");
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Refund failed. Check backend logs."
      );
    }
  };

  /* =========================
     DECIDE RETURN / REPLACE
  ========================= */
  const decideReturn = async (
    orderId: string,
    decision: "Approved" | "Rejected"
  ) => {
    const res = await API.put(
      `/orders/${orderId}/return/decision`,
      { decision }
    );

    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? res.data : o
      )
    );
  };

  /* =========================
     UI
  ========================= */
  return (
   <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      <h1 className="text-2xl font-semibold mb-6">
        Admin Orders
      </h1>

      <table className="w-full border">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-2 text-left">User</th>
            <th className="p-2">Total</th>
            <th className="p-2">Order Status</th>
            <th className="p-2">Payment</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b">
              {/* USER */}
              <td className="p-2">
                <p className="font-medium">
                  {order.user?.name ?? "Guest User"}
                </p>
                <p className="text-sm text-gray-500">
                  {order.user?.email ?? "N/A"}
                </p>
              </td>

              {/* TOTAL */}
              <td className="p-2 text-center">
                ₹{order.totalAmount}
              </td>

              {/* STATUS */}
              <td className="p-2 text-center">
                {order.status}
              </td>

              {/* PAYMENT */}
              <td className="p-2 text-center">
                <p>{order.paymentMethod}</p>
                <p className="text-sm text-gray-500">
                  {order.paymentStatus}
                </p>
              </td>

              {/* ACTIONS */}
              <td className="p-2 text-center space-y-2">
                {/* UPDATE STATUS */}
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                  className="border px-2 py-1"
                >
                  <option>Placed</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>

                {/* CANCEL */}
                <button
                  disabled={
                    order.status === "Delivered" ||
                    order.status === "Cancelled"
                  }
                  onClick={() => cancelOrder(order._id)}
                  className={`block mx-auto px-3 py-1 text-sm rounded ${
                    order.status === "Delivered" ||
                    order.status === "Cancelled"
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-red-600 text-white"
                  }`}
                >
                  Cancel
                </button>

                {/* REFUND */}
                {order.paymentMethod === "RAZORPAY" &&
                  order.paymentStatus === "Paid" &&
                  order.status !== "Cancelled" && (
                    <button
                      onClick={() =>
                        refundOrder(order._id)
                      }
                      className="block mx-auto px-3 py-1 text-sm rounded bg-yellow-500 text-white"
                    >
                      Refund
                    </button>
                  )}

                {/* RETURN / REPLACE */}
                {order.returnRequest?.requested &&
                  order.returnRequest.status ===
                    "Pending" && (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() =>
                          decideReturn(
                            order._id,
                            "Approved"
                          )
                        }
                        className="bg-green-600 text-white text-sm px-3 py-1 rounded"
                      >
                        Approve{" "}
                        {order.returnRequest.type}
                      </button>

                      <button
                        onClick={() =>
                          decideReturn(
                            order._id,
                            "Rejected"
                          )
                        }
                        className="bg-red-500 text-white text-sm px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
              </td>
            </tr>
          ))}

          {orders.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="text-center py-10 text-gray-500"
              >
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
