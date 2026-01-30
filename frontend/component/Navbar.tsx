"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b shadow-sm">

    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold">
          <span className="text-rose-600">Ethnic</span>Wear
        </Link>

        {/* DESKTOP */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">

          <Link href="/category/kurti">Kurti</Link>
          <Link href="/category/suit">Suit</Link>
          <Link href="/category/lehenga">Lehenga</Link>

          <Link href="/wishlist">❤️</Link>
          <Link href="/cart">🛒</Link>
          <Link href="/orders">📦</Link>

          {user ? (
            <>
              <Link href="/profile">👤</Link>
              <button onClick={logout} className="text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-rose-600">Login</Link>
              <Link
                href="/register"
                className="bg-black text-white px-4 py-2 rounded-full"
              >
                Register
              </Link>
            </>
          )}

        </nav>

        {/* MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-6 py-4 border-t space-y-4 bg-white text-sm">

   

          <Link href="/wishlist">❤️ Wishlist</Link>
          <Link href="/cart">🛒 Cart</Link>
          <Link href="/orders">📦 Orders</Link>

          {user ? (
            <>
              <Link href="/profile">👤 Profile</Link>
              <button onClick={logout} className="text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link
                href="/register"
                className="block bg-black text-white py-2 rounded-full text-center"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
