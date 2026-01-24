"use client";

import API from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function WishlistButton({
  productId,
}: {
  productId: string;
}) {
  const { user } = useAuth();

  const toggleWishlist = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    await API.post(`/wishlist/${productId}`);
  };

  return (
    <button
      onClick={toggleWishlist}
      className="absolute top-2 right-2 text-xl"
    >
      ❤️
    </button>
  );
}
