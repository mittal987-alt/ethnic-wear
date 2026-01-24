import "../app/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import Navbar from "../component/Navbar";
import { WishlistProvider } from "@/context/WishlistContext";
import Footer from "@/component/Footer";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
          <WishlistProvider>{children}</WishlistProvider>

          </CartProvider>
        </AuthProvider>
          <Footer />
      </body>
    </html>
  );
}
