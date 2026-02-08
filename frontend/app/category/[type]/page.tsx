import ProductCard from "../../../component/ProductCard";
import { Product } from "@/types/product";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ type?: string }>;
}) {
  const { type } = await params;

  if (!type) {
    return (
      <p className="text-gray-500 text-center mt-20">
        Invalid category.
      </p>
    );
  }

  const category = type.toLowerCase();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`,
    { cache: "no-store" }
  );

  const products: Product[] = res.ok ? await res.json() : [];

  const filteredProducts = products.filter(
    (p) =>
      typeof p.category === "string" &&
      p.category.toLowerCase() === category
  );

  return (
    <main className="bg-white">

      {/* 🌸 CATEGORY HERO */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold capitalize mb-4">
            {category}
          </h1>
          <p className="text-gray-600 text-lg">
            Handpicked styles curated just for you
          </p>
        </div>
      </section>

      {/* 🛍 PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">

        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">
              No products available in this category.
            </p>
            <p className="mt-2 text-sm">
              New collections coming soon ✨
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

      </section>
    </main>
  );
}
