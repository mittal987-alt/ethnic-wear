import dotenv from "dotenv";

dotenv.config();

if (!process.env.RAZORPAY_KEY_ID) {
  console.error("❌ ENV NOT LOADED");
} else {
  console.log("✅ ENV LOADED");
}
