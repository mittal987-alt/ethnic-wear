
import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  image?: string;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { keyword?: string };
}) {
  const keyword = searchParams.keyword || "";

  const res = await fetch(
    `http://localhost:5000/api/products/search?keyword=${encodeURIComponent(
      keyword
    )}`,
    { cache: "no-store" }
  );

  const products: Product[] = res.ok ? await res.json() : [];

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">
        Search results for “{keyword}”
      </h1>

      {products.length === 0 && (
        <p className="text-gray-500">No products found</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/product/${product._id}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <div className="h-60 bg-gray-100">
              {product.image ? (
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  Image coming soon
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium">{product.title}</h3>
              <p className="text-gray-500 capitalize text-sm">
                {product.category}
              </p>
              <p className="text-rose-600 font-semibold mt-1">
                ₹{product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
