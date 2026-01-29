"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function ProductDetailClient({ product }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleBuyNow = () => {
    if (!user) {
      router.push("/login");
    } else {
      // later → checkout
      alert("Proceed to checkout");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
  
      {/* IMAGE */}
      <div className="h-[420px] bg-gray-100 flex items-center justify-center rounded">
        <span className="text-gray-400">Product Image</span>
      </div>

      {/* DETAILS */}
      <div>
        <h1 className="text-3xl font-semibold">
          {product.title}
        </h1>

        <p className="text-xl font-medium mt-2">
          ₹{product.price}
        </p>

        <p className="mt-6 text-gray-600 leading-relaxed">
          {product.description}
        </p>

        {/* SIZE SELECTOR */}
        {product.sizes.length > 0 && (
          <div className="mt-6">
            <p className="font-medium mb-2">Select Size</p>

            <div className="flex gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-4 py-2 rounded
                    ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "hover:border-black"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* BUY BUTTON */}
        <button
          onClick={handleBuyNow}
          className="mt-8 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          Buy Now
        </button>
      </div>
    </main>
  );
}
