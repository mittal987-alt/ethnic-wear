"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("cod");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = () => {
    alert("Order placed successfully!");
    router.push("/");
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">

      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-4">

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            placeholder="Full Name"
            className="border rounded-lg px-4 py-2 w-full"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            placeholder="Phone"
            className="border rounded-lg px-4 py-2 w-full"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <input
          placeholder="Address"
          className="border rounded-lg px-4 py-2 w-full"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            placeholder="City"
            className="border rounded-lg px-4 py-2 w-full"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            placeholder="Pincode"
            className="border rounded-lg px-4 py-2 w-full"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />
        </div>

        {/* PAYMENT */}
        <div className="pt-4">
          <p className="font-medium mb-2">Payment Method</p>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={payment === "cod"}
                onChange={() => setPayment("cod")}
              />
              Cash on Delivery
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={payment === "online"}
                onChange={() => setPayment("online")}
              />
              Online Payment
            </label>
          </div>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center pt-6 border-t mt-6">
          <h2 className="text-lg font-semibold">
            Total: ₹{total}
          </h2>

          <button
            onClick={placeOrder}
            className="bg-black text-white px-8 py-3 rounded-lg hover:opacity-90 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </main>
  );
}
