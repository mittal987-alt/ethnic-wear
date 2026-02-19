"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <main className="p-10 text-center">
        Your cart is empty
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      {cart.map((item) => (
        <div
          key={item._id}
          className="flex gap-6 items-center border-b py-4"
        >
          {item.images && (
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`}
               className="w-24 h-24 sm:h-36 object-cover rounded"  />
          )}

          <div className="flex-1">
            <h2>{item.title}</h2>
            <p>₹{item.price}</p>

            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item._id, Number(e.target.value))
              }
              className="border px-2 py-1 w-16 mt-2"
            />
          </div>

          <button
            onClick={() => removeFromCart(item._id)}
            className="text-red-600"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mt-6 text-right">
        <p className="text-xl font-medium">Total: ₹{total}</p>
       <button
  onClick={() => router.push("/checkout")}
  className="mt-4 bg-black text-white px-6 py-3 rounded"
>
  Checkout
</button>

      </div>
    </main>
  );
}
