"use client";

import "../app/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "../component/Navbar";
import Footer from "@/component/Footer";
import { usePathname } from "next/navigation";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Pages where navbar & footer should be hidden
  const hideLayout = ["/login", "/register"].includes(pathname);

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>

              {!hideLayout && <Navbar />}

              {children}

              {!hideLayout && <Footer />}

            </WishlistProvider>
          </CartProvider>
        </AuthProvider>

        {/* Razorpay Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}