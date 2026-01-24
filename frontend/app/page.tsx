import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  image?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/* 🔥 TRENDING */
async function getTrending(): Promise<Product[]> {
  const res = await fetch(`${BACKEND_URL}/api/products/trending`, {
    cache: "no-store",
  });
  return res.ok ? res.json() : [];
}

/* 🆕 NEW ARRIVALS (LAST 7 DAYS) */
async function getNewArrivals(): Promise<Product[]> {
  const res = await fetch(`${BACKEND_URL}/api/products/new-arrivals`, {
    cache: "no-store",
  });
  return res.ok ? res.json() : [];
}

export default async function HomePage() {
  const trendingProducts = await getTrending();
  const newArrivals = await getNewArrivals();

  return (
    <main>

      {/* HERO */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Ethnic Wear for Every Occasion
          </h1>
          <p className="text-gray-600 mb-8">
            Discover premium Kurtis, Suits & Lehengas
          </p>

          <Link
            href="/category/kurti"
            className="bg-black text-white px-8 py-3 rounded"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* 🔥 TRENDING */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold mb-8">✨ Trending Now</h2>

        {trendingProducts.length === 0 && (
          <p className="text-gray-500">No trending products yet</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {trendingProducts.map((p) => (
            <Link
              key={p._id}
              href={`/product/${p._id}`}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={`${BACKEND_URL}${p.image}`}
                alt={p.title}
                className="h-60 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="text-sm font-medium">{p.title}</h3>
                <p className="text-rose-600 font-semibold">
                  ₹{p.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🆕 NEW ARRIVALS */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-8">🆕 New Arrivals</h2>

          {newArrivals.length === 0 && (
            <p className="text-gray-500">No new arrivals</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((p) => (
              <Link
                key={p._id}
                href={`/product/${p._id}`}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-white"
              >
                <img
                  src={`${BACKEND_URL}${p.image}`}
                  alt={p.title}
                  className="h-60 w-full object-cover"
                />

                <div className="p-4">
                  <h3 className="font-medium">{p.title}</h3>
                  <p className="text-gray-500 text-sm capitalize">
                    {p.category}
                  </p>
                  <p className="font-semibold mt-2">₹{p.price}</p>
                  <span className="text-xs text-green-600">🆕 New</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
