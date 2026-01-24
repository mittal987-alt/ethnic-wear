import ProductCard from "@/component/ProductCard";

export default async function WishlistPage() {
  const res = await fetch(
    "http://localhost:5000/api/wishlist",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      cache: "no-store",
    }
  );

  const products = await res.json();

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-8">❤️ My Wishlist</h1>

      {products.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
