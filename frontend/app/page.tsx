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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-orange-50">

      {/* 🌸 HERO */}
      <section className="relative py-28 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Elegant Ethnic Wear
          </h1>

          <p className="text-gray-600 text-lg mb-12 max-w-xl mx-auto">
            Handpicked kurtis, suits & lehengas crafted with timeless elegance
          </p>

          <Link
            href="/category/kurti"
            className="inline-block bg-black text-white px-12 py-4 rounded-full
            hover:bg-rose-600 hover:scale-105 transition shadow-xl"
          >
            Explore Collection →
          </Link>
        </div>
      </section>

      {/* 🔥 TRENDING */}
      <section className="max-w-7xl mx-auto px-6 py-16 mt-10 rounded-3xl bg-white/80 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.08)] border border-white/60">
        <h2 className="text-3xl font-semibold mb-12">✨ Trending Now</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {trendingProducts.map((p) => (
            <Link
              key={p._id}
              href={`/product/${p._id}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-56 bg-gray-100 overflow-hidden">
                {p.images?.[0] ? (
                  <img
                    src={`${BACKEND_URL}${p.images[0]}`}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    No image
                  </div>
                )}

                <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs px-4 py-1 rounded-full shadow">
                  Trending
                </span>
              </div>

              <div className="p-5">
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
      <section className="max-w-7xl mx-auto px-6 py-24 mt-16 rounded-3xl bg-white/80 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.08)] border border-white/60">
        <h2 className="text-3xl font-semibold mb-14 text-center">
          Shop By Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            { name: "Kurti", slug: "kurti", img: "/kurt.jpg" },
            { name: "Suit", slug: "suit", img: "/suit.jpg" },
            { name: "Lehenga", slug: "lehenga", img: "/lehenga.jpg" },
          ].map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center pb-8">
                <h3 className="text-white text-3xl font-bold tracking-wide">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🆕 NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-6 py-16 mt-16 mb-24 rounded-3xl bg-white/80 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.08)] border border-white/60">
        <h2 className="text-3xl font-semibold mb-12">🆕 New Arrivals</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {newArrivals.map((p) => (
            <Link
              key={p._id}
              href={`/product/${p._id}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-56 bg-gray-100 overflow-hidden">
                {p.images?.[0] ? (
                  <img
                    src={`${BACKEND_URL}${p.images[0]}`}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    No image
                  </div>
                )}

                <span className="absolute top-4 right-4 bg-green-600 text-white text-xs px-4 py-1 rounded-full shadow">
                  New
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-medium line-clamp-1">{p.title}</h3>
                <p className="text-gray-500 text-sm capitalize">{p.category}</p>
                <p className="font-bold text-lg mt-1">₹{p.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}