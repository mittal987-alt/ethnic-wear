"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import API from "../../../services/api";

/* ---------- TYPES ---------- */
interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
}

/* ---------- PAGE ---------- */
export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);

  /* FETCH PRODUCT */
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
      );
      const data = await res.json();
      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  /* CHECK IF USER CAN REVIEW */
  useEffect(() => {
    API.get(`/orders/can-review/${id}`)
      .then((res) => setCanReview(res.data.canReview))
      .catch(() => setCanReview(false));
  }, [id]);

  if (loading) return <p className="p-10">Loading product...</p>;
  if (!product) return <p className="p-10">Product not found</p>;

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
      
      {/* IMAGE */}
      <div className="bg-gray-100 h-96 flex items-center justify-center rounded">
        {product.image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_Backend_URL.replace("/api", "")}${product.image}`}
            alt={product.title}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <span className="text-gray-400">No image available</span>
        )}
      </div>

      {/* DETAILS */}
      <div>
        <h1 className="text-3xl font-semibold">{product.title}</h1>

        <p className="text-xl mt-4 font-medium">₹{product.price}</p>

        <p className="mt-2 text-gray-500 capitalize">
          Category: {product.category}
        </p>

        {product.description && (
          <p className="mt-6 text-gray-700">{product.description}</p>
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
          className="mt-8 bg-black text-white px-8 py-3 rounded hover:bg-gray-800"
        >
          Add to Cart
        </button>

        {/* REVIEW SECTION */}
        <div className="mt-10">
          {canReview ? (
            <ReviewForm productId={product._id} />
          ) : (
            <p className="text-sm text-gray-500">
              Only customers who purchased this product can write a review.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
/* ---------- REVIEW FORM COMPONENT ---------- */
function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const submitReview = async (e: React.FormEvent) => {  
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/products/${productId}/reviews`, {
        rating,
        comment,
      }); 
      setSuccessMessage("Review submitted successfully!");
      setRating(5);
      setComment("");
    } catch (error) {
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submitReview} className="border-t pt-6">
      <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>     
      {successMessage && (
        <p className="mb-4 text-green-600">{successMessage}</p>
      )}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded px-3 py-2 w-full" 
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">  
        <label className="block mb-1 font-medium">Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded px-3 py-2 w-full"
          rows={4}
          required
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
      > 
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}