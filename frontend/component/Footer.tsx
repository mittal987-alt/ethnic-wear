import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">
            EthnicWear
          </h2>
          <p className="text-sm leading-relaxed">
            Premium ethnic fashion for every occasion.  
            Discover kurtis, suits & lehengas crafted with elegance.
          </p>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Categories
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/category/kurti">Kurti</Link></li>
            <li><Link href="/category/suit">Suit</Link></li>
            <li><Link href="/category/lehenga">Lehenga</Link></li>
            <li><Link href="/category/dupatta">Dupatta</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Customer Care
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/orders">My Orders</Link></li>
            <li><Link href="/returns">Returns & Refunds</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/faq">FAQs</Link></li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Stay Updated
          </h3>
          <p className="text-sm mb-4">
            Subscribe to get offers & new arrivals.
          </p>

          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded-l bg-gray-800 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-rose-600 px-4 py-2 rounded-r text-white text-sm hover:bg-rose-700"
            >
              Subscribe
            </button>
          </form>

          {/* SOCIAL */}
          <div className="flex gap-4 mt-4 text-lg">
            <span className="cursor-pointer hover:text-white">🌐</span>
            <span className="cursor-pointer hover:text-white">📸</span>
            <span className="cursor-pointer hover:text-white">🐦</span>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EthnicWear. All rights reserved.
      </div>
    </footer>
  );
}
