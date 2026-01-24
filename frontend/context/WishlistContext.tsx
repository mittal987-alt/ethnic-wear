"use client";
import { createContext, useContext, useState } from "react";

const WishlistContext = createContext<any>(null);

export function WishlistProvider({ children }: any) {
  const [wishlist, setWishlist] = useState<any[]>([]);

  const toggleWishlist = (product: any) => {
    setWishlist((prev) =>
      prev.find((p) => p._id === product._id)
        ? prev.filter((p) => p._id !== product._id)
        : [...prev, product]
    );
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
