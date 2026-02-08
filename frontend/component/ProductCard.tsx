import Link from "next/link";
import { Product } from "@/types/product";
import WishlistButton from "./WishlistButton";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ProductCard({ product }: { product: Product }) {
  // ✅ FIXED IMAGE LOGIC
  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? `${BACKEND_URL}${product.images[0]}`
      : null;

  return (
    <Link
      href={`/product/${product._id}`}
      className="group relative bg-white rounded-3xl overflow-hidden border
      shadow-sm hover:shadow-2xl transition-all duration-300"
    >
      {/* ❤️ Wishlist floating */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton productId={product._id} />
      </div>

      {/* 🏷 Discount badge */}
      {product.mrp && (
        <span className="absolute top-3 left-3 z-10 bg-rose-600 text-white text-xs px-3 py-1 rounded-full shadow">
          {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
        </span>
      )}

      {/* IMAGE */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={product.title}
            className="w-full h-full object-cover
            group-hover:scale-110 transition duration-700"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm">
            Image coming soon
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-1">
        <h2 className="font-medium text-sm line-clamp-1">
          {product.title}
        </h2>

        <p className="text-xs text-gray-500 capitalize">
          {product.category}
        </p>

        <p className="font-bold text-lg text-rose-600 mt-1">
          ₹{product.price}
        </p>

        {product.mrp && (
          <p className="text-xs text-gray-400 line-through">
            ₹{product.mrp}
          </p>
        )}
      </div>
    </Link>
  );
}