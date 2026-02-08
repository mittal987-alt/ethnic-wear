"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWishlist, toggleWishlist } from "@/services/wishlist";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Product {
  _id: string;
  title: string;
  price: number;
  images?: string[];
  category: string;
}

export default function WishlistPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===== LOAD WISHLIST ===== */
  useEffect(() => {
    getWishlist()
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  /* ===== REMOVE (TOGGLE) ===== */
  const removeItem = async (productId: string) => {
    await toggleWishlist(productId);
    setItems((prev) => prev.filter((p) => p._id !== productId));
  };

  if (loading) {
    return <p className="p-10 text-center">Loading wishlist...</p>;
  }

  if (items.length === 0) {
    return <p className="p-10 text-center">❤️ Wishlist is empty</p>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {items.map((product) => {
          const image =
            Array.isArray(product.images) && product.images.length > 0
              ? `${BACKEND_URL}${product.images[0]}`
              : null;

          return (
            <div
              key={product._id}
              className="border rounded-lg overflow-hidden hover:shadow transition"
            >
              <Link href={`/product/${product._id}`}>
                <div className="h-56 bg-gray-100 overflow-hidden">
                  {image ? (
                    <img
                      src={image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                      No image available
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <h2 className="font-medium line-clamp-1">
                  {product.title}
                </h2>

                <p className="text-sm text-gray-500 capitalize">
                  {product.category}
                </p>

                <p className="mt-2 font-semibold text-pink-600">
                  ₹{product.price}
                </p>

                <button
                  onClick={() => removeItem(product._id)}
                  className="mt-3 text-sm text-red-600 hover:underline"
                >
                  Remove from wishlist
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}