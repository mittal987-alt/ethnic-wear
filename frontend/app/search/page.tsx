
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
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?keyword=${encodeURIComponent(
      keyword
    )}`,
    { cache: "no-store" }
  );

  const products: Product[] = res.ok ? await res.json() : [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      <h1 className="text-2xl font-semibold mb-6">
        Search results for “{keyword}”
      </h1>

      {products.length === 0 && (
        <p className="text-gray-500">No products found</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/product/${product._id}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <div className="h-60 bg-gray-100">
              {product.image ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}`}
                  alt={product.title}
                   className="w-full h-48 sm:h-56 object-cover rounded"  />
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
