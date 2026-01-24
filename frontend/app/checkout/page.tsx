"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import API from "../../services/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<"COD" | "RAZORPAY">("COD");

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* LOAD RAZORPAY SCRIPT */
  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });

  /* PLACE ORDER */
  const placeOrder = async () => {
    if (!cart.length) return;

    try {
      // 1️⃣ CREATE ORDER (BACKEND)
      const { data: order } = await API.post("/orders", {
        items: cart,
        totalAmount,
        shippingAddress: {
          fullName,
          address,
          city,
          pincode,
          phone,
        },
        paymentMethod,
      });

      // 2️⃣ COD FLOW
      if (paymentMethod === "COD") {
        clearCart();
        alert("Order placed with Cash on Delivery");
        router.push("/orders");
        return;
      }

      // 3️⃣ ONLINE PAYMENT
      await loadRazorpay();

      const { data } = await API.post(
        "/payment/create-order",
        { orderId: order._id }
      );

      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "Ethnic Wear",
        description: "Order Payment",
        order_id: data.razorpayOrderId,
        handler: async (response: any) => {
          await API.post("/payment/verify", response);
          clearCart();
          alert("Payment successful");
          router.push("/orders");
        },
      };

      const razorpay = new (window as any).Razorpay(
        options
      );
      razorpay.open();
    } catch (err) {
      alert("Checkout failed");
    }
  };

  if (cart.length === 0) {
    return <p className="p-10">Your cart is empty</p>;
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6">
        Checkout
      </h1>

      {/* ADDRESS */}
      <input
        placeholder="Full Name"
        className="border w-full p-3 mb-3"
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        placeholder="Address"
        className="border w-full p-3 mb-3"
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        placeholder="City"
        className="border w-full p-3 mb-3"
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        placeholder="Pincode"
        className="border w-full p-3 mb-3"
        onChange={(e) => setPincode(e.target.value)}
      />
      <input
        placeholder="Phone"
        className="border w-full p-3 mb-6"
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* PAYMENT METHOD */}
      <div className="mb-6">
        <p className="font-medium mb-2">
          Payment Method
        </p>

        <label className="flex items-center gap-2 mb-2">
          <input
            type="radio"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          Cash on Delivery
        </label>

        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={paymentMethod === "RAZORPAY"}
            onChange={() =>
              setPaymentMethod("RAZORPAY")
            }
          />
          Online Payment
        </label>
      </div>

      <p className="text-lg font-medium mb-4">
        Total: ₹{totalAmount}
      </p>

      <button
        onClick={placeOrder}
        className="w-full bg-black text-white py-3 rounded"
      >
        {paymentMethod === "COD"
          ? "Place Order"
          : "Pay Now"}
      </button>
    </main>
  );
}
