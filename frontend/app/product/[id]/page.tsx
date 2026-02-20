"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import API from "../../../services/api";

interface Product {
  _id: string;
  title: string;
  price: number;
  mrp?: number;
  category: string;
  description?: string;
  images?: string[];
  stock?: number;
  sizes?: string[];
  colors?: string[];
}

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    API.get(`/orders/can-review/${id}`)
      .then(res => setCanReview(res.data.canReview))
      .catch(() => setCanReview(false));
  }, [id]);

  if (loading) return <p className="p-10">Loading product...</p>;
  if (!product) return <p className="p-10">Product not found</p>;

  const discount =
    product.mrp
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* IMAGE SLIDER */}
        <div>
          <div className="bg-gray-100 rounded-xl p-4">
            <Image
              src={
                `${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images?.[active] ?? "/uploads/placeholder.png"}`
              }
              alt={product.title}
              width={1000}
              height={600}
              className="w-full max-h-[500px] object-cover rounded-lg"
              unoptimized
            />
          </div>

          <div className="flex gap-3 mt-4">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded overflow-hidden border cursor-pointer ${
                  active === i ? "border-black" : ""
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${img}`}
                  alt={`${product.title} ${i + 1}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div>

          <h1 className="text-3xl font-bold">{product.title}</h1>

          <div className="flex items-center gap-4 mt-3">
            <p className="text-2xl text-green-600 font-semibold">
              ₹{product.price}
            </p>

            {product.mrp && (
              <>
                <p className="line-through text-gray-400">₹{product.mrp}</p>
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-500 mt-1 capitalize">
            Category: {product.category}
          </p>

          {product.stock !== undefined && (
            <p className={`mt-2 font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
          )}

          {product.description && (
            <p className="mt-5 text-gray-700 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* SIZE */}
          {product.sizes && (
            <div className="mt-5">
              <p className="font-medium mb-2">Size</p>
              <div className="flex gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className="border px-4 py-1 rounded hover:bg-black hover:text-white transition"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* COLOR */}
          {product.colors && (
            <div className="mt-4">
              <p className="font-medium mb-2">Color</p>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <span
                    key={color}
                    className="border px-4 py-1 rounded"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            disabled={product.stock === 0}
            onClick={() =>
              addToCart({
                _id: product._id,
                title: product.title,
                price: product.price,
                  images: product.images,
                quantity: 1,
              })
            }
            className="mt-8 bg-black text-white w-full py-4 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
          >
            🛒 Add to Cart
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
