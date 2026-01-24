"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

const { cart } = useCart();
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
        <Link href="/" className="font-semibold text-xl">
          EthnicWear
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/category/kurti">Kurti</Link>
          <Link href="/category/suit">Suit</Link>
          <Link href="/category/lehenga">Lehenga</Link>
          <Link href="/category/dupatta">Dupatta</Link>

<Link href="/cart">
  Cart ({cart.length})
</Link>
<Link href="/orders">My Orders</Link>
          {!user ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
            
          ) : (
            <button onClick={logout} className="text-red-600">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
