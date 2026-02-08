"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState(0);

  useEffect(() => {
    API.get("/auth/me")
      .then(res => setUser(res.data))
      .catch(() => router.push("/login"));

    API.get("/orders/my")
      .then(res => setOrders(res.data.length))
      .catch(() => {});
  }, []);

  if (!user) return <p className="p-10">Loading profile...</p>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">

      <div className="bg-white shadow rounded-xl p-8">

        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="space-y-3">
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
          <p className="text-sm text-gray-500">
            Joined {new Date(user.createdAt).toDateString()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">

          <button
            onClick={() => router.push("/orders")}
            className="bg-black text-white py-3 rounded-lg hover:bg-gray-800"
          >
            📦 My Orders ({orders})
          </button>

          <button
            onClick={() => router.push("/wishlist")}
            className="border py-3 rounded-lg hover:bg-gray-100"
          >
            ❤️ Wishlist
          </button>

        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="mt-8 text-red-600 hover:underline"
        >
          Logout
        </button>

      </div>

    </main>
  );
}
