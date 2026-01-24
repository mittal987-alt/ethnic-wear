import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

// 🔒 DO NOT CRASH SERVER
let razorpay = null;

if (keyId && keySecret) {
  razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
} else {
  console.warn("⚠️ Razorpay keys not found. Razorpay disabled.");
}

export default razorpay;
