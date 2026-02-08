import API from "@/services/api";

export const getWishlist = () => API.get("/wishlist");

export const toggleWishlist = (productId: string) =>
  API.post(`/wishlist/${productId}`);