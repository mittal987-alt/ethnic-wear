import Link from "next/link";
import { Product } from "@/types/product";

import WishlistButton from "./WishlistButton";


export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product._id}`}>
      <div className="border rounded cursor-pointer hover:shadow transition overflow-hidden">
         <WishlistButton productId={product._id} />
<div className="h-60 bg-gray-100">
                  {product.image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}`}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      Image coming soon
                    </div>
                  )}
                </div>

        {/* CONTENT */}
        <div className="p-4">
          <h2 className="font-medium text-lg">{product.title}</h2>
          <p className="text-sm text-gray-500 capitalize">
            {product.category}
          </p>
          <p className="mt-2 font-semibold text-pink-600">
            ₹{product.price}
          </p>
        </div>
      </div>
    </Link>
  );
}
