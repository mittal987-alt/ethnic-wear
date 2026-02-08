"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0f172a]/90 backdrop-blur-xl shadow-md"
          : "bg-black backdrop-blur-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-widest text-white hover:opacity-90 hover:drop-shadow-[0_0_6px_#fb7185] transition duration-300"
        >
          ZOOBI <span className="text-rose-500">DOOBI</span>
        </Link>

        {/* DESKTOP */}
        <nav className="hidden md:flex items-center gap-12 text-sm font-semibold text-gray-200">

          {/* CATEGORIES */}
          <div className="flex gap-8">
            {["Kurti", "Suit", "Lehenga"].map((item) => (
              <Link
                key={item}
                href={`/category/${item.toLowerCase()}`}
                className="relative group hover:text-rose-400 transition duration-300"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-rose-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* ICONS */}
          <div className="flex items-center gap-6 text-lg">

            {/* Wishlist */}
            <div className="relative group">
              <Link
                href="/wishlist"
                className="hover:text-rose-400 hover:scale-110 transition duration-300"
              >
                ❤️
              </Link>
              <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2
                opacity-0 group-hover:opacity-100 transition text-xs bg-black text-white
                px-2 py-1 rounded">
                Wishlist
              </span>
            </div>

            {/* Cart */}
            <div className="relative group">
              <Link
                href="/cart"
                className="relative hover:text-rose-400 hover:scale-110 transition duration-300"
              >
                🛒
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] px-1.5 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
              <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2
                opacity-0 group-hover:opacity-100 transition text-xs bg-black text-white
                px-2 py-1 rounded">
                Cart
              </span>
            </div>

            {/* Orders */}
            <div className="relative group">
              <Link
                href="/orders"
                className="hover:text-rose-400 hover:scale-110 transition duration-300"
              >
                📦
              </Link>
              <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2
                opacity-0 group-hover:opacity-100 transition text-xs bg-black text-white
                px-2 py-1 rounded">
                Orders
              </span>
            </div>

            {/* Profile */}
            <div className="relative group">
              <Link
                href="/profile"
                className="hover:text-rose-400 hover:scale-110 transition duration-300"
              >
                👤
              </Link>
              <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2
                opacity-0 group-hover:opacity-100 transition text-xs bg-black text-white
                px-2 py-1 rounded">
                Profile
              </span>
            </div>

          </div>

          {/* AUTH */}
          {user ? (
            <button
              onClick={logout}
              className="text-rose-400 hover:text-rose-500 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="hover:text-white transition duration-300">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-rose-600 hover:bg-rose-700 hover:scale-105 px-5 py-2 rounded-full text-white transition duration-300 shadow-lg"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white text-2xl hover:text-rose-400 transition duration-300"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU (UNCHANGED) */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          open ? "max-h-[260px]" : "max-h-0"
        }`}
      >
        <div className="px-6 py-4 bg-gradient-to-b from-gray-900 to-black text-gray-200 space-y-4">

          <div className="flex gap-4">
            <Link href="/category/kurti">Kurti</Link>
            <Link href="/category/suit">Suit</Link>
            <Link href="/category/lehenga">Lehenga</Link>
          </div>

          <hr className="border-gray-700" />

          <div className="flex gap-4">
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/cart">Cart ({cart.length})</Link>
            <Link href="/orders">Orders</Link>
            <Link href="/profile">Profile</Link>
          </div>

          <hr className="border-gray-700" />

          {user ? (
            <button onClick={logout} className="text-rose-400">
              Logout
            </button>
          ) : (
            <div className="flex justify-between">
              <Link href="/login">Login</Link>
              <Link href="/register" className="text-rose-400 font-semibold">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}