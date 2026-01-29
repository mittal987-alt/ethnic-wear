"use client";

import ProductCard from "@/component/ProductCard";
import { useEffect, useState } from "react";

/* ---------- TYPE ---------- */
interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  image?: string;
}

/* ---------- PAGE ---------- */
export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };

    fetchWishlist();
  }, []);

  if (loading) return <p className="p-10">Loading wishlist...</p>;

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-8">❤️ My Wishlist</h1>

      {products.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p: Product) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
