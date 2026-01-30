"use client";

import { useState } from "react";
import API from "../../../../services/api";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [mrp, setMrp] = useState<number>(0);
  const [stock ,setStock] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("kurti");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    if (!title || !mrp || !price || images.length === 0) {
      alert("Please fill all fields & add images");
      return;
    }

    if (images.length > 5) {
      alert("Max 5 images allowed");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("mrp", String(mrp));
    formData.append("price", String(price));
    formData.append("category", category);
    formData.append("stock", String(stock));
formData.append("sizes", JSON.stringify(sizes));
formData.append("colors", JSON.stringify(colors));


    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      setLoading(true);
      await API.post("/products", formData);
      alert("Product added successfully 🎉");
      router.push("/admin");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <input
        className="border w-full p-3 mb-4 rounded"
        placeholder="Product title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border w-full p-3 mb-4 rounded"
        placeholder="Product description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          className="border p-3 rounded"
          placeholder="MRP (₹)"
          type="number"
          value={mrp}
          onChange={(e) => setMrp(Number(e.target.value))}
        />

        <input
          className="border p-3 rounded"
          placeholder="Selling Price (₹)"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <input
 type="number"
 placeholder="Stock quantity"
 onChange={(e)=>setStock(Number(e.target.value))}
/>
<input
 placeholder="Sizes (comma separated)"
 onChange={(e)=>setSizes(e.target.value.split(","))}
/>
<input
 placeholder="Colors (comma separated)"
 onChange={(e)=>setColors(e.target.value.split(","))}
/>



      <select
        className="border w-full p-3 mb-4 rounded"
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
        multiple
        className="mb-2"
        onChange={(e) =>
          setImages(Array.from(e.target.files || []))
        }
      />

      <p className="text-sm text-gray-500 mb-6">
        Upload up to 5 images
      </p>

      <button
        onClick={submitHandler}
        disabled={loading}
        className="bg-black text-white w-full py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Add Product"}
      </button>

    </main>
  );
}
