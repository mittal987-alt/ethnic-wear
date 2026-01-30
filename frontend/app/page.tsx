import Link from "next/link";
import { Product } from "@/types/product";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/* 🔥 TRENDING */
async function getTrending(): Promise<Product[]> {
  const res = await fetch(`${BACKEND_URL}/api/products/trending`, {
    cache: "no-store",
  });
  return res.ok ? res.json() : [];
}

/* 🆕 NEW ARRIVALS */
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
    <main className="bg-white">

      {/* 🌸 HERO */}
      <section className="relative bg-gradient-to-r from-rose-50 to-orange-50 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Elegant Ethnic Wear
          </h1>
          <p className="text-gray-600 text-lg mb-10">
            Handpicked Kurtis, Suits & Lehengas for every moment
          </p>

          <Link
            href="/category/kurti"
            className="bg-black text-white px-10 py-4 rounded-full hover:bg-gray-800 transition shadow-lg"
          >
            Explore Collection →
          </Link>
        </div>
      </section>

      {/* 🔥 TRENDING */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-semibold mb-10">
          ✨ Trending Now
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {trendingProducts.map((p) => (
            <Link
              key={p._id}
              href={`/product/${p._id}`}
              className="group rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-xl transition"
            >
              <div className="relative overflow-hidden">
                <img
                  src={`${BACKEND_URL}${p.image}`}
                  alt={p.title}
                  className="w-full h-56 object-cover transform group-hover:scale-110 transition duration-500"
                />

                <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs px-3 py-1 rounded-full">
                  Trending
                </span>
              </div>

              <div className="p-4 space-y-1">
                <h3 className="text-sm font-medium line-clamp-1">
                  {p.title}
                </h3>
                <p className="text-rose-600 font-bold text-lg">
                  ₹{p.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
{/* 🛍 SHOP BY CATEGORY */}
<section className="max-w-7xl mx-auto px-6 py-16">
  <h2 className="text-3xl font-semibold mb-10 text-center">
    Shop By Category
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

    {[
      { name: "Kurti", slug: "kurti", img: "/kurti.jpg" },
      { name: "Suit", slug: "suit", img: "/suit.jpg" },
      { name: "Lehenga", slug: "lehenga", img: "/lehenga.jpg" },
    ].map((cat) => (
      <Link
        key={cat.slug}
        href={`/category/${cat.slug}`}
        className="group relative rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
      >
        <img
          src={cat.img}
          className="w-full h-72 object-cover group-hover:scale-110 transition duration-500"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h3 className="text-white text-2xl font-bold tracking-wide">
            {cat.name}
          </h3>
        </div>
      </Link>
    ))}

  </div>
</section>

      {/* 🆕 NEW ARRIVALS */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-10">
            🆕 New Arrivals
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {newArrivals.map((p) => (
              <Link
                key={p._id}
                href={`/product/${p._id}`}
                className="group bg-white rounded-2xl overflow-hidden border hover:shadow-xl transition"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={`${BACKEND_URL}${p.image}`}
                    alt={p.title}
                    className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
                  />

                  <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                    New
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <h3 className="font-medium line-clamp-1">
                    {p.title}
                  </h3>

                  <p className="text-gray-500 text-sm capitalize">
                    {p.category}
                  </p>

                  <p className="font-bold text-lg mt-1">
                    ₹{p.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
