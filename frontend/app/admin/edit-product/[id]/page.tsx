"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "@/services/api";

interface FormData {
  title: string;
  price: number;
  mrp: number;
  category: string;
  stock: number;
  description: string;
  isTrending: boolean;
}

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    title: "",
    price: 0,
    mrp: 0,
    category: "kurti",
    stock: 0,
    description: "",
    isTrending: false,
  });

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    if (!id) return;

    API.get(`/products/${id}`).then((res) => {
      setForm({
        title: res.data.title,
        price: Number(res.data.price),
        mrp: Number(res.data.mrp),
        category: res.data.category,
        stock: Number(res.data.stock),
        description: res.data.description,
        isTrending: res.data.isTrending,
      });
    });
  }, [id]);

  /* ================= UPDATE ================= */
  const submitHandler = async () => {
    try {
      await API.put(`/products/${id}`, form);
      alert("Product updated successfully");
      router.push("/admin");
    } catch (err: any) {
      console.error("UPDATE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <main className="max-w-xl mx-auto p-10 space-y-4">
      <h1 className="text-2xl font-bold">Edit Product</h1>

      <input
        className="border w-full p-2"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="Title"
      />

      <input
        className="border w-full p-2"
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        placeholder="Price"
      />

      <input
        className="border w-full p-2"
        type="number"
        value={form.mrp}
        onChange={(e) => setForm({ ...form, mrp: Number(e.target.value) })}
        placeholder="MRP"
      />

      <input
        className="border w-full p-2"
        type="number"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
        placeholder="Stock"
      />

      <textarea
        className="border w-full p-2"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        placeholder="Description"
      />

      <select
        className="border w-full p-2"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      >
        <option value="kurti">Kurti</option>
        <option value="suit">Suit</option>
        <option value="lehenga">Lehenga</option>
        <option value="dupatta">Dupatta</option>
      </select>

      <label className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={form.isTrending}
          onChange={(e) =>
            setForm({ ...form, isTrending: e.target.checked })
          }
        />
        Trending Product
      </label>

      <button
        onClick={submitHandler}
        className="bg-black text-white py-2 rounded w-full"
      >
        Update Product
      </button>
    </main>
  );
}