"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";

export default function AddProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mrp, setMrp] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [category, setCategory] = useState("kurti");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const discount =
    mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const submitHandler = async () => {
    if (!title || !mrp || !price || images.length === 0) {
      alert("Please fill all required fields");
      return;
    }

    if (images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("mrp", String(mrp));
    formData.append("price", String(price));
    formData.append("stock", String(stock));
    formData.append("category", category);
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
    <main className="max-w-4xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-10">
        ➕ Add New Product
      </h1>

      {/* TITLE */}
      <input
        className="w-full border p-3 rounded mb-5"
        placeholder="Product title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* DESCRIPTION */}
      <textarea
        className="w-full border p-3 rounded mb-5"
        rows={4}
        placeholder="Product description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* PRICE SECTION */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <input
          type="number"
          className="border p-3 rounded"
          placeholder="MRP ₹"
          value={mrp}
          onChange={(e) => setMrp(Number(e.target.value))}
        />
        <input
          type="number"
          className="border p-3 rounded"
          placeholder="Selling Price ₹"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>

      {discount > 0 && (
        <p className="text-green-600 font-medium mb-5">
          🔥 {discount}% Discount
        </p>
      )}

      {/* STOCK */}
      <input
        type="number"
        className="w-full border p-3 rounded mb-5"
        placeholder="Stock quantity"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
      />

      {/* SIZES */}
      <input
        className="w-full border p-3 rounded mb-5"
        placeholder="Sizes (comma separated: S,M,L)"
        onChange={(e) =>
          setSizes(
            e.target.value.split(",").map((s) => s.trim())
          )
        }
      />

      {/* COLORS */}
      <input
        className="w-full border p-3 rounded mb-5"
        placeholder="Colors (comma separated: Red,Blue)"
        onChange={(e) =>
          setColors(
            e.target.value.split(",").map((c) => c.trim())
          )
        }
      />

      {/* CATEGORY */}
      <select
        className="w-full border p-3 rounded mb-5"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="kurti">Kurti</option>
        <option value="suit">Suit</option>
        <option value="lehenga">Lehenga</option>
        <option value="dupatta">Dupatta</option>
      </select>

      {/* IMAGES */}
      <input
        type="file"
        accept="image/*"
        multiple
        className="mb-3"
        onChange={(e) =>
          setImages(Array.from(e.target.files || []))
        }
      />

      <p className="text-sm text-gray-500 mb-6">
        Upload up to 5 images
      </p>

      {/* IMAGE PREVIEW */}
      {images.length > 0 && (
        <div className="flex gap-4 flex-wrap mb-8">
          {images.map((img, index) => (
            <img
              key={index}
              src={URL.createObjectURL(img)}
              className="w-24 h-24 object-cover rounded border"
              alt="preview"
            />
          ))}
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={submitHandler}
        disabled={loading}
        className="bg-black text-white w-full py-4 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Add Product"}
      </button>

    </main>
  );
}