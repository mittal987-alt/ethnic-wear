import ProductCard from "../../../component/ProductCard";

import { Product } from "@/types/product";
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ type?: string }>;
}) {
  // ✅ REQUIRED IN NEXT 16
  const { type } = await params;

  if (!type) {
    return (
      <p className="text-gray-500 text-center mt-10">
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
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold capitalize">
        {category}
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="mt-8 text-gray-500">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
