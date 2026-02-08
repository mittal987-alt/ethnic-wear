"use client";

import { toggleWishlist } from "@/services/wishlist";

interface Props {
  productId: string;
}

export default function WishlistButton({ productId }: Props) {
  return (
    <button
      onClick={async (e) => {
        e.preventDefault(); // important when inside Link
        try {
          await toggleWishlist(productId);
          alert("Wishlist updated");
        } catch {
          alert("Please login first");
        }
      }}
      className="text-xl"
    >
      ❤️
    </button>
  );
}