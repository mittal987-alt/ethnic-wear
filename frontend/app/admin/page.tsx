"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import API from "../../services/api";

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
}

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data));
    API.get("/orders").then(res => setOrders(res.data));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await API.put(`/orders/${id}/status`, { status });

    setOrders(prev =>
      prev.map(o => o._id === id ? res.data : o)
    );
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete product?")) return;

    await API.delete(`/products/${id}`);
    setProducts(p => p.filter(x => x._id !== id));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 space-y-16">

      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      {/* ================= PRODUCTS ================= */}

      <section>
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold">Products</h2>
          <Link
            href="/admin/add"
            className="bg-black text-white px-4 py-2 rounded"
          >
            + Add Product
          </Link>
          <Link 
          href="/admin/orders" className="bg-blue-600 text-white px-4 py-2 rounded">
            All Orders
          </Link>
          <Link 
          href="/admin/return" className="bg-purple-600 text-white px-4 py-2 rounded">
            All Returns
          </Link>
          <Link 
          href="/admin/customer" className="bg-green-600 text-white px-4 py-2 rounded">
            All Customers
          </Link>
          
        </div>

        <div className="space-y-3">

          {products.map(p => (
            <div
              key={p._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{p.title}</p>
                <p>₹{p.price}</p>

                {p.stock < 5 && (
                  <p className="text-red-600 text-sm">
                    ⚠ Low stock: {p.stock}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Link
                  href={`/admin/edit-product/${p._id}`}
                  className="border px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteProduct(p._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ORDERS ================= */}

      

    </main>
  );
}
