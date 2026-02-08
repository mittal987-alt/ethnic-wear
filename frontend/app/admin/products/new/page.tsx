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
  const [stock, setStock] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("kurti");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    if (!title || !mrp || !price || images.length === 0) {
      alert("Fill all fields & add images");
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

    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);
      await API.post("/products", formData);
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">

      <h1 className="text-3xl font-semibold mb-8">
        Add New Product
      </h1>

      <div className="bg-white border rounded-2xl shadow-sm p-8 space-y-6">

        <input
          className="input"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="input h-28"
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <input className="input" type="number" placeholder="MRP" onChange={(e)=>setMrp(+e.target.value)} />
          <input className="input" type="number" placeholder="Selling Price" onChange={(e)=>setPrice(+e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <input className="input" type="number" placeholder="Stock" onChange={(e)=>setStock(+e.target.value)} />
          <input className="input" placeholder="Sizes (S,M,L)" onChange={(e)=>setSizes(e.target.value.split(","))} />
          <input className="input" placeholder="Colors (Red,Blue)" onChange={(e)=>setColors(e.target.value.split(","))} />
        </div>

        <select className="input" value={category} onChange={(e)=>setCategory(e.target.value)}>
          <option>kurti</option>
          <option>suit</option>
          <option>lehenga</option>
          <option>dupatta</option>
        </select>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e)=>setImages(Array.from(e.target.files || []))}
        />

        <button
          onClick={submitHandler}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>

      </div>
    </main>
  );
}
