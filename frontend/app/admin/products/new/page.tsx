"use client";

import { useState } from "react";
import API from "../../../../services/api";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("kurti");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    if (!title || !price || !image) {
      alert("Title, price and image are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", String(price));
    formData.append("category", category);
    formData.append("image", image); // ✅ correct

    try {
      setLoading(true);

      await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully");
      router.push("/admin");
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Product upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6">
        Add Product
      </h1>

      <input
        className="border w-full p-2 mb-4"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border w-full p-2 mb-4"
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <select
        className="border w-full p-2 mb-4"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="kurti">Kurti</option>
        <option value="suit">Suit</option>
        <option value="lehenga">Lehenga</option>
        <option value="dupatta">Dupatta</option>
      </select>

      <input
        type="file"
        accept="image/*"
        className="mb-4"
        onChange={(e) =>
          setImage(e.target.files?.[0] || null)
        }
      />

      <button
        onClick={submitHandler}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </main>
  );
}
