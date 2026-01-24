"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API from "../../services/api";
import Link from "next/link";

/* ---------- TYPES ---------- */

interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  isTrending: boolean;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  delivered: number;
  cancelled: number;
}

/* ---------- COMPONENT ---------- */

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  /* 🔐 PROTECT ADMIN ROUTE */
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/");
    }
  }, [user, loading, router]);

  /* 📊 FETCH STATS */
  useEffect(() => {
    if (user?.role === "admin") {
      API.get("/orders/stats/admin").then((res) =>
        setStats(res.data)
      );
    }
  }, [user]);

  /* 📦 FETCH PRODUCTS */
  useEffect(() => {
    if (user?.role === "admin") {
      API.get("/products").then((res) =>
        setProducts(res.data)
      );
    }
  }, [user]);

  if (loading) {
    return <p className="p-10">Checking admin access...</p>;
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome, {user.name}
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/products/new")}
          className="bg-black text-white px-6 py-3 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Orders" value={stats.totalOrders} />
          <StatCard title="Revenue" value={`₹${stats.totalRevenue}`} />
          <StatCard title="Delivered" value={stats.delivered} />
          <StatCard title="Cancelled" value={stats.cancelled} />
        </div>
      )}

      {/* QUICK LINKS */}
      <div className="flex gap-6 mb-10">
        <Link href="/admin/orders" className="underline">
          Manage Orders
        </Link>
        <Link href="/admin/products/new" className="underline">
          Add Product
        </Link>
      </div>

      {/* PRODUCT TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-4 py-3">{product.title}</td>
                <td className="px-4 py-3 capitalize">
                  {product.category}
                </td>
                <td className="px-4 py-3">₹{product.price}</td>

                <td className="px-4 py-3 flex gap-4 items-center">
                  {/* EDIT */}
                  <button
                    onClick={() =>
                      router.push(`/admin/products/${product._id}`)
                    }
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  {/* TRENDING TOGGLE */
                  }
                  <button
                  onClick={async () => {
                  const url = product.isTrending
                  ? `/products/${product._id}/trending/disable`
                  : `/products/${product._id}/trending/enable`;

                 const res = await API.put(url);

                  setProducts((prev) =>
                  prev.map((p) =>
                   p._id === product._id ? res.data : p
                    )
                   );
                 }}
                 className={`text-sm ${
                 product.isTrending ? "text-green-600" : "text-gray-500"
                  } `}
                  >
                  {product.isTrending ? "★ Trending" : "☆ Make Trending"}
                  </button>

            

                  {/* DELETE */}
                  <button
                    onClick={async () => {
                      if (confirm("Delete this product?")) {
                        await API.delete(`/products/${product._id}`);
                        setProducts((prev) =>
                          prev.filter(
                            (p) => p._id !== product._id
                          )
                        );
                      }
                    }}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  No products added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

/* ---------- STAT CARD ---------- */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="border rounded p-5 text-center">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}
