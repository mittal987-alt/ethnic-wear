"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import API from "../../../../services/api";

interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("kurti");
  const [description, setDescription] = useState("");
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  /* FETCH PRODUCT */
  useEffect(() => {
    API.get(`/products/${id}`).then((res) => {
      const product: Product = res.data;
      setTitle(product.title);
      setPrice(String(product.price));
      setCategory(product.category);
      setDescription(product.description || "");
      setCurrentImage(product.image || null);
      setLoading(false);
    });
  }, [id]);

  const submitHandler = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("description", description);
    if (newImage) formData.append("image", newImage);

    await API.put(`/products/${id}`, formData);

    router.push("/admin");
  };

  if (loading) {
    return <p className="p-10">Loading product...</p>;
  }

  return (
   <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      <h1 className="text-2xl font-semibold mb-6">Edit Product</h1>

      {/* TITLE */}
      <input
        className="border w-full p-3 mb-4"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* PRICE */}
      <input
        type="number"
        className="border w-full p-3 mb-4"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* CATEGORY */}
      <select
        className="border w-full p-3 mb-4"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="kurti">Kurti</option>
        <option value="suit">Suit</option>
        <option value="lehenga">Lehenga</option>
        <option value="dupatta">Dupatta</option>
      </select>

      {/* DESCRIPTION */}
      <textarea
        className="border w-full p-3 mb-4"
        rows={4}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* CURRENT IMAGE */}
      {currentImage && (
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            Current Image
          </p>
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${currentImage}`}
            alt="Current"
             className="w-full h-48 sm:h-56 object-cover rounded"   />
        </div>
      )}
      
    

      {/* NEW IMAGE */}
      <input
        type="file"
        accept="image/*"
        className="mb-6"
        onChange={(e) =>
          setNewImage(e.target.files?.[0] || null)
        }
      />

      {/* SUBMIT */}
      <button
        onClick={submitHandler}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Update Product
      </button>
    </main>
  );
}
