"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-900 via-gray-950 to-black text-gray-300 mt-20"
    >

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-3">
            ZOOBI <span className="text-rose-500">DOOBI</span>
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Premium ethnic fashion crafted with elegance for every occasion.
          </p>

          <div className="flex gap-4 text-xl">
            {["🌐", "📸", "🐦"].map((icon, i) => (
              <span
                key={i}
                className="cursor-pointer hover:text-rose-400 hover:shadow-[0_0_12px_#fb7185] transition"
              >
                {icon}
              </span>
            ))}
          </div>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="text-white font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            {["kurti", "suit", "lehenga", "dupatta"].map((item) => (
              <li key={item}>
                <Link
                  href={`/category/${item}`}
                  className="hover:text-rose-400 transition"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Customer Care</h3>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-rose-400" href="/orders">My Orders</Link></li>
            <li><Link className="hover:text-rose-400" href="/returns">Returns</Link></li>
            <li><Link className="hover:text-rose-400" href="/contact">Contact</Link></li>
            <li><Link className="hover:text-rose-400" href="/faq">FAQs</Link></li>
          </ul>
        </div>

        {/* APP + EMAIL */}
        <div>
          <h3 className="text-white font-semibold mb-3">Get the App</h3>

          <div className="flex gap-3 mb-4">
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-xs hover:bg-gray-700 transition cursor-pointer">
              📱 Play Store
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg text-xs hover:bg-gray-700 transition cursor-pointer">
              🍎 App Store
            </div>
          </div>

          <div className="flex rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 bg-gray-800 text-sm outline-none text-white"
            />
            <button className="bg-rose-600 px-4 text-white text-sm hover:bg-rose-700 transition">
              Go
            </button>
          </div>
        </div>
      </div>

      {/* TRUST BADGES */}
      <div className="border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-between gap-4 text-sm text-gray-400">
          <span>🔐 Secure Payments</span>
          <span>🚚 Fast Delivery</span>
          <span>💵 Cash on Delivery</span>
          <span>↩ Easy Returns</span>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-800 py-4 text-center text-xs sm:text-sm text-gray-500">
        © {new Date().getFullYear()} ZOOBI DOOBI — Fashion with elegance.
      </div>

    </motion.footer>
  );
}
