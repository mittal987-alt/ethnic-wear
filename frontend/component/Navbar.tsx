"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="text-xl font-bold">
          EthnicWear
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/category/kurti">Kurti</Link>
          <Link href="/category/suit">Suit</Link>
          <Link href="/category/lehenga">Lehenga</Link>
          <Link href="/wishlist">Wishlist ❤️</Link>
          <Link href="/cart">Cart 🛒</Link>
          <Link href="/orders">my orders</Link>

          {!user ? (
            <>
              <Link href="/login" className="text-blue-600">Login</Link>
              <Link
                href="/register"
                className="bg-black text-white px-4 py-1 rounded"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="text-red-600 font-medium"
            >
              Logout
            </button>
          )}
        </nav>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3 text-sm">

          <Link href="/category/kurti" onClick={() => setOpen(false)}>Kurti</Link>
          <Link href="/category/suit" onClick={() => setOpen(false)}>Suit</Link>
          <Link href="/category/lehenga" onClick={() => setOpen(false)}>Lehenga</Link>
          <Link href="/wishlist" onClick={() => setOpen(false)}>Wishlist ❤️</Link>
          <Link href="/cart" onClick={() => setOpen(false)}>Cart 🛒</Link>
          <Link href="/orders" onClick={() => setOpen(false)}>my orders</Link>
          {!user ? (
            <>
              <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="block bg-black text-white px-4 py-2 rounded text-center"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="text-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
