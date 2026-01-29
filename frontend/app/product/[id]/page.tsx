"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import API from "../../../services/api";

interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
}

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);

  // ✅ FETCH PRODUCT (axios only)
  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // ✅ CHECK REVIEW
  useEffect(() => {
    API.get(`/orders/can-review/${id}`)
      .then(res => setCanReview(res.data.canReview))
      .catch(() => setCanReview(false));
  }, [id]);

  if (loading) return <p className="p-10">Loading product...</p>;
  if (!product) return <p className="p-10">Product not found</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        <div className="bg-gray-100 rounded-xl p-4 flex justify-center">
          {product.image ? (
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}`}
              className="w-full max-h-[500px] object-cover rounded-lg"
              alt={product.title}
            />
          ) : (
            <span>No image</span>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-2xl text-green-600 mt-2">₹{product.price}</p>
          <p className="text-gray-500 capitalize mt-1">{product.category}</p>

          {product.description && (
            <p className="mt-4 text-gray-700">{product.description}</p>
          )}

          <button
            onClick={() =>
              addToCart({
                _id: product._id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1,
              })
            }
            className="mt-6 bg-black text-white px-8 py-3 rounded-xl"
          >
            Add to Cart
          </button>

          <div className="mt-8 border-t pt-4">
            {canReview ? (
              <p className="text-green-600">You can review this product</p>
            ) : (
              <p className="text-gray-500 text-sm">
                Purchase required to review
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
