import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  image?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

async function getCategoryProducts(slug: string): Promise<Product[]> {
  const res = await fetch(
    `${BACKEND_URL}/api/products/category/${slug}`,
    { cache: "no-store" }
  );
  return res.json();
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const products = await getCategoryProducts(params.slug);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold capitalize mb-8">
        {params.slug}
      </h1>

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
                  src={`${BACKEND_URL}${product.image}`}
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
              <h3 className="font-medium">{product.title}</h3>
              <p className="text-sm text-gray-500 capitalize">
                {product.category}
              </p>
              <p className="mt-2 font-semibold text-rose-600">
                ₹{product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
