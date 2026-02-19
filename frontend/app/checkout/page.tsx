"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import API from "../../services/api";
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
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

  /* ============================
     MAIN PLACE ORDER BUTTON
  ============================ */
  const placeOrder = async () => {

  if (payment === "cod") {
    await API.post("/orders", {
      items: cart.map(item => ({
        product: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0]
      })),
      totalAmount: total,
      shippingAddress: { fullName, address, city, pincode, phone },
      paymentMethod: "COD",
      paymentStatus: "Pending"
    });

    alert("Order placed!");
    router.push("/orders");
    return;
  }

  try {
    // ✅ CREATE ORDER FIRST
    const orderRes = await API.post("/orders", {
      items: cart.map(item => ({
        product: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0]
      })),
      totalAmount: total,
      shippingAddress: { fullName, address, city, pincode, phone },
      paymentMethod: "RAZORPAY",
      paymentStatus: "Pending"
    });

    const orderId = orderRes.data._id;

    // ✅ NOW CREATE RAZORPAY ORDER
    const payRes = await API.post("/payment/create-order", { orderId });

    const options = {
      key: payRes.data.key,
      amount: payRes.data.amount,
      currency: "INR",
      order_id: payRes.data.razorpayOrderId,

      handler: async (response:RazorpayResponse) => {
        await API.post("/payment/verify", response);
        alert("Payment successful!");
        router.push("/orders");
      }
    };

    new window.Razorpay(options).open();

  } catch (err) {
    console.error("PAYMENT FLOW ERROR:", err);
    alert("Payment failed");
  }
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

        {/* PAYMENT METHOD */}
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
                checked={payment === "razorpay"}
                onChange={() => setPayment("razorpay")}
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